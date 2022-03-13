import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import { ItemMapArr } from '~/typings/data';
import styles from './index.module.less';

type SProps = {};

// 示例代码特殊处理 swiper 的 useLayoutEffect 在服务端渲染报错，实际应用可自行删除
React.useLayoutEffect = React.useEffect;

interface Props extends SProps {
  data: ItemMapArr[];
}

const params = {
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    loop: true,
  },
};

function Slider(props: any) {
  const data = props.data[0];
  return (
    <div className={styles.swiperContainer}>
      <Swiper {...params}>
        {data.itemMap.map(
          (val: {
            img: string;
            title:
              | boolean
              | React.ReactChild
              | React.ReactFragment
              | React.ReactPortal
              | null
              | undefined;
          }) => (
            <SwiperSlide key={val.img}>
              <div
                className={styles.sliderContainer}
                onClick={() =>
                  props.history.push('/detail/cbba934b14f747049187')
                }
              >
                <img src={val.img} className={styles.carouselImg} alt="" />
                <div className={styles.sliderDescContainer}>
                  <span className={styles.sliderTitle}>{val.title}</span>
                </div>
              </div>
            </SwiperSlide>
          ),
        )}
      </Swiper>
    </div>
  );
}

export default Slider;
