import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FullPlaylist } from '../../Model/FullPlaylistModel';
import PriceTableDisplay from '../Templates/PriceTableDisplay';
import { PriceTable } from '../../Model/PriceTableModel';

type Props = {
  playlist: FullPlaylist;
};

const PlaylistCarousel: React.FC<Props> = ({ playlist }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Efeito que muda o slide automaticamente baseado no tempo (em segundos) de cada item
  useEffect(() => {
    const currentItem = playlist.items[currentIndex];
    const timeout = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % playlist.items.length);
    }, currentItem.seconds * 1000);

    return () => clearTimeout(timeout);
  }, [currentIndex, playlist.items]);

  return (
    <Carousel
      selectedItem={currentIndex}
      showArrows={false}
      showThumbs={false}
      showStatus={false}
      infiniteLoop
      autoPlay={false} // Controle manual via useEffect
    >
      {playlist.items.map((item, index) => (
        <div key={index} style={{ width: '100%', height: '100%' }}>
          {(() => {
            switch (item.type) {
              case 'image':
                return (
                  <img
                    src={item.media.url}
                    alt={item.media.desc || `Imagem ${index}`}
                    style={{
                      objectFit: 'contain',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto'
                    }}
                  />
                );
              case 'video':
                return (
                  <video
                    src={item.media.url}
                    autoPlay
                    loop
                    muted
                    style={{ width: '100%', height: '100%' }}
                  />
                );
              
              case 'priceTable':
                return (
                  <PriceTableDisplay
                    template={item.template}
                    products={item.products}
                    tableName={"TEste"}
                  />
                );
              default:
                return null;
            }
          })()}
        </div>
      ))}
    </Carousel>
  );
};

export default PlaylistCarousel;
