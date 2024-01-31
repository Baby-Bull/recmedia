import classNames from "classnames";
import React, { ReactNode } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import styles from "src/components/home/home.module.scss";

interface ISlickSliderRecommendComponentProps {
  items: Array<ReactNode>;
}

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={style} onClick={onClick}>
      <div className={styles.slickArrow}>
        {!className?.includes("slick-disabled") && (
          <img src="/assets/images/home_page/ic_arrow_medium.svg" alt="next" />
        )}
      </div>
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;

  return (
    <div className={className} style={style} onClick={onClick}>
      <div className={styles.slickArrow}>
        {!className?.includes("slick-disabled") && (
          <img src="/assets/images/home_page/ic_arrow_medium.svg" alt="prev" className="rotate-180" />
        )}
      </div>
    </div>
  );
};

const setInfiniteSlick = (temp: number) => temp > 4;
const SlickSliderRecommendComponent: React.SFC<ISlickSliderRecommendComponentProps> = ({ items }) => {
  const settingsSlickOfNotification = {
    dots: 4,
    infinite: setInfiniteSlick(items?.length),
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,

    responsive: [
      {
        breakpoint: 992,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  return (
    <div className={classNames("slick-custom-recommend")}>
      <div className="box-content">
        <Slider {...settingsSlickOfNotification}>{items}</Slider>
      </div>
    </div>
  );
};

export default SlickSliderRecommendComponent;
