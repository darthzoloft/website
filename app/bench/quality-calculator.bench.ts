import { bench, describe } from 'vitest';

import type { ArchestraMcpServerManifest } from '@mcpCatalog/types';

import {
  calculateBadgeUsageScore,
  calculateDependenciesScore,
  calculateDeploymentMaturityScore,
  calculateDocumentationScore,
  calculateGitHubMetricsScore,
  calculateMCPProtocolScore,
  calculateQualityScore,
} from '../app/mcp-catalog/lib/quality-calculator';

function createServerManifest(overrides?: Partial<ArchestraMcpServerManifest>): ArchestraMcpServerManifest {
  return {
    name: 'test-server',
    display_name: 'Test Server',
    description: 'A test MCP server',
    readme: null,
    category: 'Development',
    quality_score: null,
    author: { name: 'Test Author' },
    server: {
      type: 'local',
      command: 'node',
      args: ['server/index.js'],
    },
    archestra_config: {
      client_config_permutations: {},
      oauth: { provider: null, required: false },
      works_in_archestra: false,
    },
    github_info: {
      owner: 'test-owner',
      repo: 'test-repo',
      url: 'https://github.com/test-owner/test-repo',
      name: 'test-repo',
      path: null,
      stars: 500,
      contributors: 15,
      issues: 30,
      releases: true,
      ci_cd: true,
      latest_commit_hash: 'abc123',
    },
    programming_language: 'TypeScript',
    framework: 'node',
    last_scraped_at: '2024-01-01',
    evaluation_model: 'claude-3-opus-20240229',
    protocol_features: {
      implementing_tools: true,
      implementing_resources: true,
      implementing_prompts: true,
      implementing_sampling: false,
      implementing_stdio: true,
      implementing_streamable_http: false,
      implementing_roots: true,
      implementing_logging: false,
      implementing_oauth2: false,
    },
    dependencies: [
      { name: 'express', importance: 8 },
      { name: 'dotenv', importance: 5 },
      { name: 'axios', importance: 7 },
    ],
    raw_dependencies: null,
    ...overrides,
  } as ArchestraMcpServerManifest;
}

function createServerCollection(count: number): ArchestraMcpServerManifest[] {
  const servers: ArchestraMcpServerManifest[] = [];
  for (let i = 0; i < count; i++) {
    servers.push(
      createServerManifest({
        name: `server-${i}`,
        display_name: `Server ${i}`,
        github_info: {
          owner: i % 3 === 0 ? 'shared-owner' : `owner-${i}`,
          repo: i % 3 === 0 ? 'shared-repo' : `repo-${i}`,
          url: `https://github.com/owner-${i}/repo-${i}`,
          name: `repo-${i}`,
          path: null,
          stars: Math.floor(Math.random() * 5000),
          contributors: Math.floor(Math.random() * 50),
          issues: Math.floor(Math.random() * 100),
          releases: i % 2 === 0,
          ci_cd: i % 3 !== 0,
          latest_commit_hash: `hash${i}`,
        },
        dependencies: Array.from({ length: Math.floor(Math.random() * 15) }, (_, j) => ({
          name: `dep-${j}`,
          importance: Math.floor(Math.random() * 10) + 1,
        })),
      })
    );
  }
  return servers;
}

describe('Quality Calculator - Individual Scores', () => {
  const server = createServerManifest();

  bench('calculateMCPProtocolScore', () => {
    calculateMCPProtocolScore(server);
  });

  bench('calculateGitHubMetricsScore', () => {
    calculateGitHubMetricsScore(server);
  });

  bench('calculateDeploymentMaturityScore', () => {
    calculateDeploymentMaturityScore(server);
  });

  bench('calculateDocumentationScore', () => {
    calculateDocumentationScore(
      createServerManifest({
        readme:
          'This is a comprehensive README with more than 100 characters explaining the MCP server, its features, installation, and usage.',
      })
    );
  });

  bench('calculateBadgeUsageScore', () => {
    calculateBadgeUsageScore(
      createServerManifest({
        readme:
          '# Server\n\n[![Quality](https://archestra.ai/badge)](link)\n\nDescription of this MCP server with features.',
      })
    );
  });

  bench('calculateDependenciesScore', () => {
    calculateDependenciesScore(server);
  });
});

describe('Quality Calculator - Full Score', () => {
  const server = createServerManifest();

  bench('calculateQualityScore - single server', () => {
    calculateQualityScore(server);
  });

  bench('calculateQualityScore - with allServers context (50 servers)', () => {
    const allServers = createServerCollection(50);
    calculateQualityScore(allServers[0], allServers);
  });

  bench('calculateQualityScore - remote server', () => {
    calculateQualityScore(
      createServerManifest({
        server: {
          type: 'remote',
          url: 'https://mcp.example.com',
          docs_url: null,
        },
        github_info: null,
      })
    );
  });
});

describe('Quality Calculator - Dependencies with catalog context', () => {
  const allServers = createServerCollection(100);

  bench('calculateDependenciesScore - with 100 servers context', () => {
    calculateDependenciesScore(allServers[0], allServers);
  });
});
