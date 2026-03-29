import React, { useState } from 'react';
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap';
import support2 from '../Images/support2.jpg';
import support5 from '../Images/support5.jpg';
import support4 from '../Images/support4.jpg';
import { useTheme } from '../ThemeContext'; // Import your theme hook

const items = [
  {
    src: support4,
    altText: '',
    caption: '',
    key: 1,
  },
  {
    src: support2,
    altText: '',
    caption: '',
    key: 2,
  },
  {
    src: support5,
    altText: '',
    caption: '',
    key: 3,
  },
];

function HomeCarousel(args) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const { theme } = useTheme();  // Get the current theme

  // Define the filters based on the theme
  const themeFilter = {
    light: 'none',
    dark: 'brightness(0.7) contrast(1.2)',
    blue: 'hue-rotate(180deg)',
    green: 'hue-rotate(90deg)',
  };

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => (
    <CarouselItem
      onExiting={() => setAnimating(true)}
      onExited={() => setAnimating(false)}
      key={item.key}
    >
      <img
        src={item.src}
        alt={item.altText}
        className="d-block w-100"
        style={{
          filter: themeFilter[theme] || 'none', // Apply the theme-based filter
          transition: 'filter 0.3s ease', // Smooth transition for the filter effect
        }}
      />
      <CarouselCaption
        captionText={item.caption}
        captionHeader={item.altText}
      />
    </CarouselItem>
  ));

  return (
    <div className="carousel-fullwidth">
      <Carousel
        fade
        activeIndex={activeIndex}
        next={next}
        previous={previous}
        {...args}
      >
        <CarouselIndicators
          items={items}
          activeIndex={activeIndex}
          onClickHandler={goToIndex}
        />
        {slides}
        <CarouselControl
          direction="prev"
          directionText="Previous"
          onClickHandler={previous}
        />
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={next}
        />
      </Carousel>
    </div>
  );
}

export default HomeCarousel;
