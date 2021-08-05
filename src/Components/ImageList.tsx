import { useEffect, useRef, useState } from 'react';
import { deleteImage, getImageList, ImageInfo, makeResizeImageUrl } from '../Service';

export default function ImageList(): JSX.Element {
  const mountedRef = useRef(false);
  // track mounted state

  useEffect( ()=>{
    mountedRef.current=true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [imageList, setImageList] = useState<undefined | ImageInfo[]>(undefined);

  useEffect(() => {
    getImageList()
      .then(imageListRes => {
        if(mountedRef.current) {
          setImageList(imageListRes);
        }
      })
      .catch(err => {
        alert(`Unexpected while retrieving image list: ${err}`);
      })
    ;
  }, [mountedRef]);

  const handleDelete = (image: ImageInfo) => {
    deleteImage(image.url)
      .then( () => {
        if(!mountedRef.current) {
          return;
        }

        if(imageList) {
          setImageList(imageList.filter( ({url}) => (image.url !== url)));
        }
      })
      .catch(err => {
        alert(`Unexpected error while deleting image: ${err}`);
      })
    ;
  };

  return <>
    <h1>Cached image list:</h1>
    
    {imageList !== undefined ?
      imageList.length > 0 ?
        <table>
          <thead>
            <tr>
              <td>Image</td>
              <td>URL</td>
              <td>Date</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {
              imageList.map(image => (
                <tr key={`${image.url}`}>
                  <td><img src={makeResizeImageUrl(image.url, 100, 100)}/></td>
                  <td>{image.url}</td>
                  <td>{new Date(image.date).toISOString()}</td>
                  <td><button onClick={() => handleDelete(image)}>Delete</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
        : <h3>No images cached yet.</h3>
      :
      <h3>Loading...</h3>
    }
  </>;
}
