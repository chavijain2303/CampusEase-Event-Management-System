import React from 'react';
import './Gallery.css';
import BG from "../../Assets/BG.png";

// Import your images and videos
import img1 from '../../Assets/GalleryPics/Pic1.jpg';
import img2 from '../../Assets/GalleryPics/Pic2.jpg';
import img3 from '../../Assets/GalleryPics/Pic3.png';
import img4 from '../../Assets/GalleryPics/Pic4.jpg';
import img5 from '../../Assets/GalleryPics/Pic5.jpg';
import img6 from '../../Assets/GalleryPics/Pic6.jpg';
import img7 from '../../Assets/GalleryPics/Pic7.png';
import img8 from '../../Assets/GalleryPics/Pic8.png';
import img9 from '../../Assets/GalleryPics/Pic9.png';
import img10 from '../../Assets/GalleryPics/Pic10.png';
import img11 from '../../Assets/GalleryPics/Pic11.png';
import img12 from '../../Assets/GalleryPics/Pic12.png';
import img13 from '../../Assets/GalleryPics/Pic13.png';
import img14 from '../../Assets/GalleryPics/Pic14.jpg';
import img15 from '../../Assets/GalleryPics/Pic15.jpg';
import img16 from '../../Assets/GalleryPics/Pic16.jpg';
import img17 from '../../Assets/GalleryPics/Pic17.jpg';
import img18 from '../../Assets/GalleryPics/Pic18.jpg';
import img19 from '../../Assets/GalleryPics/Pic19.jpg';
import img20 from '../../Assets/GalleryPics/Pic20.jpg';
import img21 from '../../Assets/GalleryPics/Pic21.jpg';
import img22 from '../../Assets/GalleryPics/Pic22.jpg';
import img23 from '../../Assets/GalleryPics/Pic23.jpg';
import video1 from '../../Assets/GalleryVids/Vid1.mp4';
import video2 from '../../Assets/GalleryVids/Vid2.mp4';
import video3 from '../../Assets/GalleryVids/Vid3.mp4';
import video4 from '../../Assets/GalleryVids/Vid4.mp4';

const Gallery = () => {
  const photos = [
    { id: 1, src: img1, caption: 'Photo 1' },
    { id: 2, src: img2, caption: 'Photo 2' },
    { id: 3, src: img3, caption: 'Photo 3' },
    { id: 4, src: img4, caption: 'Photo 4' },
    { id: 5, src: img5, caption: 'Photo 5' },
    { id: 6, src: img6, caption: 'Photo 6' },
    { id: 7, src: img7, caption: 'Photo 7' },
    { id: 8, src: img8, caption: 'Photo 8' },
    { id: 9, src: img9, caption: 'Photo 9' },
    { id: 10, src: img10, caption: 'Photo 10' },
    { id: 11, src: img11, caption: 'Photo 11' },
    { id: 12, src: img12, caption: 'Photo 12' },
    { id: 13, src: img13, caption: 'Photo 13' },
    { id: 14, src: img14, caption: 'Photo 14' },
    { id: 15, src: img15, caption: 'Photo 15' },
    { id: 16, src: img16, caption: 'Photo 16' },
    { id: 17, src: img17, caption: 'Photo 17' },
    { id: 18, src: img18, caption: 'Photo 18' },
    { id: 19, src: img19, caption: 'Photo 19' },
    { id: 20, src: img20, caption: 'Photo 20' },
    { id: 21, src: img21, caption: 'Photo 21' },
    { id: 22, src: img22, caption: 'Photo 22' },
    { id: 23, src: img23, caption: 'Photo 23' }
  ];

  const videos = [
    { id: 1, src: video1, caption: 'Video 1' },
    { id: 2, src: video2, caption: 'Video 2' },
    { id: 3, src: video3, caption: 'Video 3' },
    { id: 4, src: video4, caption: 'Video 4' }
  ];

  return (
    <div className="GalleryBG" style={{ backgroundImage: `url(${BG})` }}>
    <div className="gallery-container">
      <h1 className="gallery-title">Campus Memories</h1>
      
      <section className="photo-gallery">
        <h2>Photos</h2>
        <div className="photo-grid">
          {photos.map((photo) => (
            <div key={photo.id} className="photo-item">
              <img src={photo.src} alt={photo.caption} />
              <div className="photo-caption">{photo.caption}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="video-gallery">
        <h2>Videos</h2>
        <div className="video-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-item">
              <video controls>
                <source src={video.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-caption">{video.caption}</div>
            </div>
          ))}
        </div>
        
      </section>
    </div>
    </div>
  );
};

export default Gallery;