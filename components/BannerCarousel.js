import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import Carousel from 'react-native-banner-carousel';
import Global from '../screens/Global';

const BannerWidth = Dimensions.get('window').width;
let BannerHeight = Dimensions.get('window').height / 1.5;

const BannerCarousel = props => {
  return (
    <View style={styles.carouselContainer}>
      <Carousel
        showsPageIndicator={false}
        autoplay
        autoplayTimeout={4000}
        loop
        index={0}
        pageSize={BannerWidth}>
        {props.bannerImgs.map(image => {
          return <RenderPage image={image}
            key={image} />;
        })}
      </Carousel>
    </View>
  );
};

const RenderPage = props => {
  return (
    <View>
      <Image
        style={{ width: BannerWidth, height: BannerHeight, resizeMode: 'cover' }}
        source={{ uri: props.image }}
      />
    </View>
  );
};

export default BannerCarousel;

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center'
  }
});
