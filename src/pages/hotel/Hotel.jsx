import './hotel.css';
import Navbar from '../../components/navbar/Navbar';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import MailList from '../../components/mailList/MailList';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import useFetch from '../../hooks/useFetch';
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import {useContext, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {SearchContext} from '../../context/SearchContext';

const Hotel = () => {
  const location = useLocation();
  const path = location.pathname.split('/')[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const {data, loading, error} = useFetch(`/hotels/find/${path}`);

  const {dates, options} = useContext(SearchContext);

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2?.getTime() - date1?.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  const days = dayDifference(dates[0]?.endDate, dates[0]?.startDate);

  const handleOpen = i => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = direction => {
    let newSlideNumber;
    if (direction === 'l') {
      newSlideNumber =
        slideNumber === 0 ? data.photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber =
        slideNumber === data.photos.length - 1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  return (
    <div>
      <Navbar />
      <Header type='list' />
      {loading ? (
        'loading'
      ) : (
        <>
          <div className='hotelContainer'>
            {open && (
              <>
                <div className='slider'>
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className='close'
                    onClick={() => {
                      setOpen(false);
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faCircleArrowLeft}
                    className='arrow'
                    onClick={() => handleMove('l')}
                  />
                  <div className='sliderWrapper'>
                    <img
                      src={data.photos[slideNumber]}
                      alt=''
                      className='sliderImg'
                    />
                  </div>
                  <FontAwesomeIcon
                    icon={faCircleArrowRight}
                    className='arrow'
                    onClick={() => handleMove('r')}
                  />
                </div>
              </>
            )}
            <div className='hotelWrapper'>
              <button className='bookNow'>Reserve or Book Now!</button>
              <h1 className='hotelTitle'>{data.name}</h1>
              <div className='hotelAddress'>
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{data.address}</span>
              </div>
              <span className='hotelDistance'>
                Excellent location - {data.distance}m from center
              </span>
              <span className='hotelPriceHighlight'>
                Book a stay over ${data.cheapestPrice} at this property and get
                a free airport taxi
              </span>
              <div className='hotelImages'>
                {data.photos?.map((photo, i) => (
                  <div className='hotelImgWrapper'>
                    <img
                      onClick={() => handleOpen(i)}
                      src={photo}
                      alt=''
                      className='hotelImg'
                    />
                  </div>
                ))}
              </div>
              <div className='hotelDetails'>
                <div className='hotelDetailsText'>
                  <div className='hotelTitle'>{data.title}</div>
                  <p className='hotelDesc'>{data.desc}</p>
                </div>
                <div className='hotelDetailsPrice'>
                  <h1>Perfect for {days}-night stay!</h1>
                  <span>
                    Located in the real heart of Krakow,this property has an
                    excellent location score of 9.8!
                  </span>
                  <h2>
                    <b>
                      {days
                        ? days * data.cheapestPrice * options.room + '$'
                        : 'Try to Search Again'}
                    </b>{' '}
                    {days ? '(' + days + 'Nights' + ')' : 'Couldnt Calculated'}
                  </h2>
                  <button>Reserve or book now!</button>
                </div>
              </div>
            </div>
            <MailList />
            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default Hotel;
