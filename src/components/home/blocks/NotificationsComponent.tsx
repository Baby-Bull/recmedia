import classNames from "classnames";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import styles from "src/components/home/home.module.scss";

// import { notificationsMockData } from "../mockData/mockData";

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={style} onClick={onClick}>
      <div className={styles.slickArrow}>
        {!className?.includes("slick-disabled") && <img src="/assets/images/home_page/ic_arrow_small.svg" alt="next" />}
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
          <img src="/assets/images/home_page/ic_arrow_small.svg" alt="prev" className="rotate-180" />
        )}
      </div>
    </div>
  );
};

const NotificationComponent = () => {
  const notificationsMockData = [
    {
      title: "ヒント",
      content: (
        <span>
          goodhubへようこそ！まずは
          <a style={{ color: "#FF9458" }} href="my-profile">
            プロフィール詳細を記入
          </a>
          してみると、マッチング率がUPします☆
        </span>
      ),
    },
    {
      title: "ヒント",
      content: (
        <span>
          goodhubへようこそ！まずは
          <a style={{ color: "#FF9458" }} href="my-profile">
            プロフィール詳細を記入
          </a>
          してみると、マッチング率がUPします☆
        </span>
      ),
    },
  ];
  // const [notifications] = useState([...notificationsMockData]);

  const settingsSlickOfNotification = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    loop: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className={classNames(styles.notificationsBlock, "homepage-notification-slick", "slick-custom")}>
      <div className="box-content">
        <Slider {...settingsSlickOfNotification}>
          {notificationsMockData?.map((notification, index) => (
            <div key={index} className="slider-item">
              <img src="/assets/images/home_page/ic_warning.svg" alt="warning" className="icon" />
              <span className="title">{notification?.title}</span>
              <span className="content">{notification?.content}</span>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default NotificationComponent;
