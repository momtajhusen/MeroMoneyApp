import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import { rw, rh, rf } from '../../themes/responsive';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const IntroScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      key: 1,
      title: 'Welcome to MeroMoney',
      text: 'Discover the ultimate personal finance app designed to help you take control of your financial life. MeroMoney simplifies the process of tracking expenses, setting budgets, and achieving your financial goals.',
      image: require('../../../assets/Intro/Welcome.png'),
      backgroundColor: theme.primary,
    },
    {
      key: 2,
      title: 'Effortless Expense Tracking',
      text: 'Track your expenses in real-time with MeroMoney. Our user-friendly interface allows you to quickly log your spending, categorize expenses, and gain insights into your financial habits.',
      image: require('../../../assets/Intro/ManageMoney.png'),
      backgroundColor: theme.primary,
    },
    {
      key: 3,
      title: 'Smart Budgeting & Progress Tracking',
      text: 'Create personalized budgets, track your spending, and visualize progress with detailed reports. MeroMoney helps you manage your finances by providing insights that allow you to improve your spending habits over time.',
      image: require('../../../assets/Intro/MoneyTrack.png'),
      backgroundColor: theme.primary,
    },
    {
      key: 4,
      title: 'Stay Notified',
      text: 'Never miss a bill payment or budget deadline again! MeroMoney sends you timely notifications, keeping you informed and organized.',
      image: require('../../../assets/Intro/Notify.png'),
      backgroundColor: theme.primary,
    },
    {
      key: 5,
      title: 'Join Us Today!',
      text: 'Take the first step towards financial freedom. Download MeroMoney and start managing your finances with ease. Achieve your financial goals today!',
      image: require('../../../assets/Intro/JoinUs.png'),
      backgroundColor: theme.primary,
    },
  ];

  const _renderSlide = (slide) => {
    return (
      <View style={[styles.slide, { backgroundColor: slide.backgroundColor }]} key={slide.key}>
        <Image source={slide.image} style={styles.image} />
        <Text style={[styles.title, { color: theme.accent }]}>{slide.title}</Text>
        <Text style={[styles.text, { color: theme.text }]}>{slide.text}</Text>
      </View>
    );
  };

  const handleDone = () => {
    navigation.navigate('Hello');
  };

  const handleNext = () => {
    if (swiperRef.current && currentIndex < slides.length - 1) {
      swiperRef.current.scrollBy(1); // Move to the next slide
    }
  };

  const handleSkip = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(slides.length - currentIndex - 1); // Skip to the last slide
    }
  };

  const handleIndexChange = (index) => {
    setCurrentIndex(index);
  };

  return (
    <View style={{ flex: 1 }}>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View style={[styles.dot, { backgroundColor: '#fff' }]} />}
        activeDot={<View style={[styles.activeDot, { backgroundColor: theme.accent }]} />}
        onIndexChanged={handleIndexChange}
        paginationStyle={styles.pagination}
      >
        {slides.map(_renderSlide)}
      </Swiper>
      
      <View style={styles.buttonContainer}>
        {currentIndex < slides.length - 1 ? (
          <View className="flex-1 space-y-3" style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, {backgroundColor:theme.accent}]} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {borderWidth:1, borderColor:theme.accent}]} onPress={handleSkip}>
              <Text style={[styles.buttonText, {color:theme.accent}]}>Skip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={[styles.button, styles.doneButton]} onPress={handleDone}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    paddingTop: rh(7),
    alignItems: 'center',
    paddingHorizontal: rw(5),
  },
  title: {
    fontSize: rf(3.5),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: rh(2),
  },
  text: {
    fontSize: rf(2),
    textAlign: 'center',
    marginHorizontal: rw(5),
  },
  image: {
    width: rw(80),
    height: rw(80),
    resizeMode: 'contain',
  },
  dot: {
    width: rw(2),
    height: rh(1),
    borderRadius: rw(1),
    marginHorizontal: rw(1.5),
  },
  activeDot: {
    width: rw(2.5),
    height: rh(1.25),
    borderRadius: rw(1.25),
  },
  pagination: {
    bottom: 220, // Set this above the button container
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50, // Position below the dots
    width: '100%',
    alignItems: 'center',
  },
  buttonRow: {
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    borderRadius: rw(3),
    paddingVertical: rh(2),
    paddingHorizontal: rw(6),
  },
  doneButton: {
    backgroundColor: '#28a745',
    width: '80%',
  },
  buttonText: {
    fontSize: rf(2.5),
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default IntroScreen;
