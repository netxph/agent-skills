#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'package.json');
const errors = [];

function fail(message) {
  errors.push(message);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`${path.relative(ROOT, file)} is not valid JSON: ${error.message}`);
    return null;
  }
}

function stringArray(value, field) {
  if (!Array.isArray(value) || value.length === 0 || value.some((entry) => typeof entry !== 'string' || entry.trim() === '')) {
    fail(`${field} must be a non-empty array of paths`);
    return [];
  }
  return value;
}

function resolveDeclaredPath(entry, field) {
  if (/[*?!]/.test(entry)) {
    fail(`${field} entry ${JSON.stringify(entry)} must be a file or directory, not a pattern`);
    return null;
  }

  const resolved = path.resolve(ROOT, entry);
  if (resolved !== ROOT && !resolved.startsWith(`${ROOT}${path.sep}`)) {
    fail(`${field} entry ${JSON.stringify(entry)} resolves outside the package`);
    return null;
  }
  if (!fs.existsSync(resolved)) {
    fail(`${field} entry ${JSON.stringify(entry)} does not exist`);
    return null;
  }
  return resolved;
}

function markdownFiles(entry, field, fileName) {
  const start = resolveDeclaredPath(entry, field);
  if (!start) return [];

  const files = [];
  function walk(current) {
    const stat = fs.statSync(current);
    if (stat.isFile()) {
      const nameMatches = fileName ? path.basename(current) === fileName : current.endsWith('.md');
      if (nameMatches) files.push(current);
      return;
    }
    if (!stat.isDirectory()) return;

    for (const dirent of fs.readdirSync(current, { withFileTypes: true })) {
      if (dirent.name.startsWith('.') || dirent.name === 'node_modules') continue;
      walk(path.join(current, dirent.name));
    }
  }
  walk(start);
  return files;
}

function requireFrontmatter(file, fields) {
  const relative = path.relative(ROOT, file);
  const content = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const match = content.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---(?:[ \t]*\r?\n|$)/);
  if (!match) {
    fail(`${relative} is missing YAML frontmatter`);
    return;
  }

  for (const field of fields) {
    const fieldMatch = match[1].match(new RegExp(`^${field}:[ \\t]*(.+?)[ \\t]*$`, 'm'));
    if (!fieldMatch || !fieldMatch[1] || fieldMatch[1] === '|' || fieldMatch[1] === '>') {
      fail(`${relative} frontmatter is missing a non-empty ${field}`);
    }
  }
}

function validateResources(entries, field, options) {
  const files = [...new Set(entries.flatMap((entry) => markdownFiles(entry, field, options.fileName)))];
  if (files.length === 0) {
    fail(`${field} does not declare any ${options.label} files`);
    return [];
  }
  for (const file of files) requireFrontmatter(file, options.frontmatter);
  return files;
}

function includesPackageRoot(files, root) {
  return files.some((entry) => entry.replace(/^\.\//, '').replace(/\/$/, '') === root);
}

function validatePlanPaths(promptFiles) {
  const byName = new Map(promptFiles.map((file) => [path.basename(file), file]));
  const required = {
    'spec.md': ['.pi/plans/SPEC.md'],
    'plan.md': ['.pi/plans/SPEC.md', '.pi/plans/plan.md', '.pi/plans/todo.md'],
    'build.md': ['.pi/plans/plan.md', '.pi/plans/todo.md'],
  };

  for (const [name, paths] of Object.entries(required)) {
    const file = byName.get(name);
    if (!file) {
      fail(`pi.prompts must include prompts/${name}`);
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');
    for (const requiredPath of paths) {
      if (!content.includes(requiredPath)) {
        fail(`prompts/${name} must use the Pi plan path ${requiredPath}`);
      }
    }
  }
}

function main() {
  const manifest = readJson(MANIFEST_PATH);
  if (!manifest) return report();

  if (manifest.name !== 'agent-skills') fail('package.json name must be agent-skills');
  if (manifest.version !== '0.6.8') fail('package.json version must remain 0.6.8');
  if (!Array.isArray(manifest.keywords) || !manifest.keywords.includes('pi-package')) {
    fail('package.json keywords must include pi-package');
  }
  for (const field of ['dependencies', 'optionalDependencies', 'bundledDependencies', 'bundleDependencies']) {
    const value = manifest[field];
    if (value && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0)) {
      fail(`package.json must not declare runtime ${field}`);
    }
  }

  const packageFiles = stringArray(manifest.files, 'package.json files');
  for (const entry of packageFiles) resolveDeclaredPath(entry, 'package.json files');
  for (const root of ['agents', 'prompts', 'references', 'skills']) {
    if (!includesPackageRoot(packageFiles, root)) fail(`package.json files must include ${root}/`);
  }

  const skills = stringArray(manifest.pi?.skills, 'pi.skills');
  const prompts = stringArray(manifest.pi?.prompts, 'pi.prompts');
  const agents = stringArray(manifest.pi?.subagents?.agents, 'pi.subagents.agents');

  if (!skills.includes('./skills')) fail('pi.skills must declare ./skills');
  if (!prompts.includes('./prompts')) fail('pi.prompts must declare ./prompts');
  if (!agents.includes('./agents')) fail('pi.subagents.agents must declare ./agents');

  validateResources(skills, 'pi.skills', {
    fileName: 'SKILL.md',
    label: 'skill',
    frontmatter: ['name', 'description'],
  });
  const promptFiles = validateResources(prompts, 'pi.prompts', {
    label: 'prompt',
    frontmatter: ['description'],
  });
  validateResources(agents, 'pi.subagents.agents', {
    label: 'agent',
    frontmatter: ['name', 'description'],
  });
  validatePlanPaths(promptFiles);

  report();
}

function report() {
  if (errors.length > 0) {
    console.error('Pi package validation FAILED:');
    for (const error of errors) console.error(`  - ${error}`);
    console.error(`\n${errors.length} error(s)`);
    process.exitCode = 1;
    return;
  }
  console.log('Pi package validation PASSED: manifest, resources, frontmatter, and plan paths are valid.');
}

main();
