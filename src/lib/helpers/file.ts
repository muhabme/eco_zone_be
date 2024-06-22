export const mimeTypesUtil = async () => import('mime-types');

/**
 * Lookup the content-type associated with a file.
 *
 * @example
 * fileLookup('json') // 'application/json'
 * fileLookup('.md') // 'text/markdown'
 * fileLookup('file.html') // 'text/html'
 * fileLookup('folder/file.js') // 'application/javascript'
 * fileLookup('folder/.htaccess') // false
 *
 * @param filenameOrExt string
 * @returns string | undefined
 */
export const fileLookup = async (
  filenameOrExt: string,
): Promise<string | undefined> => {
  const mime = await mimeTypesUtil();

  const type = mime.lookup(filenameOrExt);

  if (type === false) {
    return;
  }

  return type;
};

/**
 * Create a full content-type header given a content-type or extension
 *
 * @example
 * fileContentType('markdown') // 'text/x-markdown; charset=utf-8'
 * fileContentType('file.json') // 'application/json; charset=utf-8'
 * fileContentType('text/html') // 'text/html; charset=utf-8'
 * fileContentType('text/html; charset=iso-8859-1') // 'text/html; charset=iso-8859-1'
 * fileContentType(path.extname('/path/to/file.json')) // 'application/json; charset=utf-8'
 *
 * @param filenameOrExt string
 * @returns string | undefined
 */
export const fileContentType = async (
  filenameOrExt: string,
): Promise<string | undefined> => {
  const mime = await mimeTypesUtil();

  const contentType = mime.contentType(filenameOrExt);

  if (contentType === false) {
    return;
  }

  return contentType;
};

/**
 * Get the default extension for a content-type.
 *
 * @example
 * fileExtension('application/octet-stream') // 'bin'
 *
 * @param typeString string
 * @returns string | undefined
 */
export const fileExtension = async (
  typeString: string,
): Promise<string | undefined> => {
  const mime = await mimeTypesUtil();

  typeString = typeString.includes('.')
    ? mime.lookup(typeString) || typeString
    : typeString;
  const extension = mime.extension(typeString);

  if (extension === false) {
    return;
  }

  return extension;
};

/**
 * Get the default extension for a content-type.
 *
 * @example
 * fileCharset('text/markdown') // 'UTF-8'
 *
 * @param typeString string
 * @returns string | undefined
 */
export const fileCharset = async (
  typeString: string,
): Promise<string | undefined> => {
  const mime = await mimeTypesUtil();

  typeString = typeString.includes('.')
    ? mime.lookup(typeString) || typeString
    : typeString;
  const charset = mime.charset(typeString);

  if (charset === false) {
    return;
  }

  return charset;
};
