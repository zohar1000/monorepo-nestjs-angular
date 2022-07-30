import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { FileUtilsOptions } from '../models/file-utils-options.model';
const fsPromises = fs.promises;
// const path = require('path');
import * as path from 'path';

@Injectable()
export class FileService {
  static getParentFolder(folder) {
    const lastSegment = path.basename(folder);
    if (!lastSegment) {
      return undefined;
    } else {
      const ix = folder.lastIndexOf(lastSegment);
      return folder.substring(0, ix);
    }
  }

  static async readAncestorFile(fileName, options: FileUtilsOptions = {}): Promise<string> {
    return new Promise(async (resolve, reject) => {
      let error;
      let text;
      let isText = false;
      let folder = options?.startFolder || process.cwd();

      while (!isText && !error) {
        try {
          const filePath = path.resolve(folder, fileName);
          text = await fsPromises.readFile(filePath, 'utf8');
          isText = true;
        } catch (e) {
          if (e.code !== 'ENOENT') {
            error = e;
          } else {
            folder = FileService.getParentFolder(folder);
            if (!folder) error = new Error(`file not found: ${fileName}`);
          }
        }
      }

      if (error && !options?.isReturnUndefinedOnError) {
        reject(error);
      } else {
        resolve(text);
      }
    });
  }

  static async getAncestorPath(requestedResource, options: FileUtilsOptions = {}): Promise<string> {
    return new Promise(async (resolve, reject) => {
      let error;
      let ancestorPath;
      let currFolder = options.startFolder || process.cwd();

      while (!ancestorPath && !error) {
        try {
          const resourcePath = path.resolve(currFolder, requestedResource);
          const stat = await fsPromises.stat(resourcePath);
          if (options.isFolder && stat.isDirectory()) {
            ancestorPath = resourcePath;
          } else if (stat.isFile()) {
            ancestorPath = resourcePath;
          } else {
            error = new Error(`${requestedResource} not found`);
          }
        } catch (e) {
          if (e.code !== 'ENOENT') {
            error = e;
          } else {
            currFolder = FileService.getParentFolder(currFolder);
            if (!currFolder) error = new Error(`${requestedResource} not found`);
          }
        }
      }

      if (error && !options?.isReturnUndefinedOnError) {
        reject(error);
      } else {
        resolve(ancestorPath);
      }
    });
  }

  static getAncestorPathSync(requestedResource, options: FileUtilsOptions = {}): string | undefined {
    let error;
    let ancestorPath: string | undefined;
    let currFolder = options.startFolder || process.cwd();

    while (!ancestorPath && !error) {
      try {
        const resourcePath = path.resolve(currFolder, requestedResource);
        const stat = fs.statSync(resourcePath);
        if (options.isFolder && stat.isDirectory()) {
          ancestorPath = resourcePath;
        } else if (stat.isFile()) {
          ancestorPath = resourcePath;
        } else {
          error = new Error(`${requestedResource} not found`);
        }
      } catch (e) {
        if (e.code !== 'ENOENT') {
          error = e;
        } else {
          currFolder = FileService.getParentFolder(currFolder);
          if (!currFolder) error = new Error(`${requestedResource} not found`);
        }
      }
    }

    if (error && !options?.isReturnUndefinedOnError) throw error;
    return ancestorPath;
  }
}
