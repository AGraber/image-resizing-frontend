import { Config } from '../Config';

export type ImageInfo = {url: string, date: number};

/**
 * Get a resized image from a url as a blob URL
 * 
 * @param url The url of the image
 * @param width Desired width of the image
 * @param height Desired height of the image
 * @returns Object URL to display the image on the browser
 */
export async function resizeImage(url: string, width: number, height: number): Promise<string> {
  const response = await fetch(`${Config.ApiUrl}/image/${encodeURIComponent(url)}/${width}/${height}`);

  if(!response.ok) {
    const json = await response.json();
    throw new Error(json.message);
  }
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
// <img key={image.url} src={image.url} />

/**
 * Construct an url to request a resized image from the API
 * 
 * @param url The url of the image
 * @param width Desired width of the image
 * @param height Desired height of the image
 * @returns URL to resize an image
 */
export function makeResizeImageUrl(url: string, width: number, height: number): string {
  return `${Config.ApiUrl}/image/${encodeURIComponent(url)}/${width}/${height}`;
}

/**
 * Delete a cached image
 * 
 * @param url The url of the image
 * @param width Desired width of the image
 * @param height Desired height of the image
 * @returns Whether the image was deleted (won't be deleted if it didn't exist in server cache)
 */
export async function deleteImage(url: string): Promise<boolean> {
  const response = await fetch(`${Config.ApiUrl}/image/${encodeURIComponent(url)}`, {
    method: 'DELETE',
  });

  const json = await response.json();

  if(!response.ok || json.error) {
    throw new Error(json.message);
  }
  return json;
}

/**
 * Get an array of all cached images
 * @returns An array of all the cached images
 */
export async function getImageList(): Promise<ImageInfo[]> {
  const response = await fetch(`${Config.ApiUrl}/image/list`);
  const json = await response.json();

  if(!response.ok || json.error) {
    throw new Error(json.message);
  }

  return json;
}
