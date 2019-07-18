import * as React from 'react';
import { LazyImage } from "react-lazy-images";

export const Image = (props) => {
    console.log(props);
    return <LazyImage
        src={props.ImgSrc ? props.ImgSrc : ''}
        alt=""
        debounceDurationMs={500}
        // This is rendered first, notice how the src is different
        placeholder={
            ({ imageProps, ref }) => (
                props.ImagePlaceholder ? <div ref={ref}><props.ImagePlaceholder /></div> : <img ref={ref} src={require('../../../asset/img/miscellaneous/imagePlaceholder.png')} style={{ width: '100%' }} />
            )

        }
        actual={
            ({ imageProps }) =>
                <img {...imageProps} />
        }
    />
}