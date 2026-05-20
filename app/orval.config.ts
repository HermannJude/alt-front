import { defineConfig } from 'orval'

export default defineConfig({
  alt_front: {
    input: {
      target: './alt-front.yml',
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/alt_front.ts',
      schemas: 'src/api/model',
      client: 'react-query',
      clean: true,
      formatter: 'prettier',
      mock: true,
      override: {
        mutator: {
          path: './src/lib/fetcher.ts',
          name: 'customFetcher',
        },
      },
    },
  },
})
