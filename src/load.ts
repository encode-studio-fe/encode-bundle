import fs from 'fs'
import JoyCon from 'joycon'
import path from 'path'
import { bundleRequire } from 'bundle-require'
import { defineConfig } from './'
import { jsoncParse } from './utils'

const joycon = new JoyCon()

const loadJson = async (filepath: string) => {
  try {
    return jsoncParse(await fs.promises.readFile(filepath, 'utf8'))
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to parse ${path.relative(process.cwd(), filepath)}: ${
          error.message
        }`
      )
    } else {
      throw error
    }
  }
}

const jsonLoader = {
  test: /\.json$/,
  load(filepath: string) {
    return loadJson(filepath)
  },
}

joycon.addLoader(jsonLoader)

export async function loadTsupConfig(
  cwd: string,
  configFile?: string
): Promise<{ path?: string; data?: ReturnType<typeof defineConfig> }> {
  const configJoycon = new JoyCon()
  const configPath = await configJoycon.resolve({
    files: configFile
      ? [configFile]
      : [
          'encode-bundle.config.ts',
          'encode-bundle.config.js',
          'encode-bundle.config.cjs',
          'encode-bundle.config.mjs',
          'encode-bundle.config.json',
          'package.json',
        ],
    cwd,
    stopDir: path.parse(cwd).root,
    packageKey: 'encode-bundle',
  });

  if (configPath) {
    if (configPath.endsWith('.json')) {
      let data = await loadJson(configPath)
      if (configPath.endsWith('package.json')) {
        data = data.tsup
      }
      if (data) {
        return { path: configPath, data }
      }
      return {}
    }

    const config = await bundleRequire({
      filepath: configPath,
    })
    return {
      path: configPath,
      data: config.mod.tsup || config.mod.default || config.mod,
    }
  }

  return {}
}

export async function loadPkg(cwd: string, clearCache: boolean = false) {
  if (clearCache) {
    joycon.clearCache()
  }
  const { data } = await joycon.load(['package.json'], cwd, path.dirname(cwd))
  return data || {}
}

/*
 * Production deps should be excluded from the bundle
 */
export async function getProductionDeps(
  cwd: string,
  clearCache: boolean = false
) {
  const data = await loadPkg(cwd, clearCache)

  const deps = Array.from(
    new Set([
      ...Object.keys(data.dependencies || {}),
      ...Object.keys(data.peerDependencies || {}),
    ])
  )

  return deps
}

/**
 * Use this to determine if we should rebuild when package.json changes
 */
export async function getAllDepsHash(cwd: string) {
  const data = await loadPkg(cwd, true)

  return JSON.stringify({
    ...data.dependencies,
    ...data.peerDependencies,
    ...data.devDependencies,
  })
}