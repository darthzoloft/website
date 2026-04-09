import { bench, describe } from 'vitest';

import { extractServerInfo } from '../app/mcp-catalog/lib/catalog';

describe('extractServerInfo', () => {
  bench('simple GitHub URL', () => {
    extractServerInfo('https://github.com/modelcontextprotocol/servers');
  });

  bench('GitHub URL with tree path', () => {
    extractServerInfo('https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem');
  });

  bench('GitHub URL with blob path', () => {
    extractServerInfo('https://github.com/modelcontextprotocol/servers/blob/main/src/fetch/index.ts');
  });

  bench('remote MCP URL', () => {
    extractServerInfo('https://mcp.huggingface.co/api/v1');
  });

  bench('GitLab URL', () => {
    extractServerInfo('https://gitlab.com/my-org/my-mcp-server');
  });

  bench('invalid URL fallback', () => {
    extractServerInfo('not-a-url');
  });
});

describe('extractServerInfo - batch processing', () => {
  const urls = [
    'https://github.com/modelcontextprotocol/servers',
    'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch',
    'https://github.com/anthropics/mcp-tools',
    'https://github.com/openai/mcp-server/tree/main/packages/core',
    'https://mcp.huggingface.co/api/v1',
    'https://mcp.example.com/remote-server',
    'https://gitlab.com/my-org/my-mcp-server',
    'https://github.com/aws/mcp-server',
    'https://github.com/google/mcp-integration/tree/main/src/search',
  ];

  bench('extract info from 10 URLs', () => {
    for (const url of urls) {
      extractServerInfo(url);
    }
  });
});
