import { useState, useEffect, useRef } from 'react';
import { resizeImage } from '../Service';
//import { resizeImage } from '../Service';

export default function Home(): JSX.Element {
  const mountedRef = useRef(false);
  // track mounted state
  useEffect( ()=>{
    mountedRef.current=true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [imageUrl, setImageUrl] = useState('');
  const [widthStr, setWidthStr] = useState('');
  const [heightStr, setHeightStr] = useState('');

  const [imageUrlResult, setImageUrlResult] = useState<undefined | string>(undefined);

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const onResizeButtonClick = async () => {
    const imageUrlClean = imageUrl.trim();

    if(!imageUrlClean) {
      alert('Please provide a URL to resize');
      return;
    }

    const width = parseInt(widthStr);
    if(isNaN(width) || width <= 0) {
      alert('Width must be a number greater than 0');
      return;
    }

    const height = parseInt(heightStr);
    if(isNaN(height) || height <= 0) {
      alert('Height must be a number greater than 0');
      return;
    }

    resizeImage(imageUrlClean, width, height)
      .then(resizedUrl => {
        if(mountedRef.current) {
          setImageUrlResult(resizedUrl);
          setSubmitButtonDisabled(false);
        }
      })
      .catch(err => {
        if(mountedRef.current) {
          alert('Error while retrieving resized image: ' + err);
          setSubmitButtonDisabled(false);
        }
      })
    ;
  };

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value);
  };

  const handleWidthStrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWidthStr(event.target.value);
  };

  const handleHeightStrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeightStr(event.target.value);
  };

  return (
    <>
      <h1>Resize image</h1>
      <label>Image URL:</label><br/>
      <input type="text" onChange={handleImageUrlChange} value={imageUrl}/>
      <br/><br/>
      <label>Width:</label><br/>
      <input type="text" onChange={handleWidthStrChange} value={widthStr}/>
      <br/><br/>
      <label>Height:</label><br/>
      <input type="text" onChange={handleHeightStrChange} value={heightStr}/><br/><br/>
      <button disabled={submitButtonDisabled} onClick={onResizeButtonClick}>Submit</button>

      {imageUrlResult &&
        <>
          <br/><br/><br/>
          <h2>Resized result:</h2>
          <img src={imageUrlResult}/>
        </>
      }
    </>
  );
}
