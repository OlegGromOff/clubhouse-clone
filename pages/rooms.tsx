import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { ConversationCard } from '../components/ConversationCard';
import { StartRoomModal } from '../components/StartRoomModal';
import Link from 'next/link'; // allow to use <a> tag with <Link> tag 
import React from 'react';
import Head from 'next/head'; // allow to change head of page (title, meta tags, etc.) 
import { checkAuth } from '../utils/checkAuth';
import { Api } from '../api';
import { GetServerSideProps, NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { selectRooms } from '../redux/selectors';
import { wrapper } from '../redux/store';
import { setRooms, setRoomSpeakers } from '../redux/slices/roomsSlice';
import { useSocket } from '../hooks/useSocket';

const RoomsPage: NextPage = () => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const rooms = useSelector(selectRooms);
  const dispatch = useDispatch();
  const socket = useSocket();

  React.useEffect(() => {
    socket.on('SERVER@ROOMS:HOME', ({ roomId, speakers }) => {
      dispatch(setRoomSpeakers({ speakers, roomId }));
    });
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Clubhouse: Drop-in audio chat</title>
      </Head>
      <Header />
      <div className="container">
        <div className=" mt-40 d-flex align-items-center justify-content-between">
          <h1>All conversations</h1>
          <Button onClick={() => setVisibleModal(true)} color="green">
            + Start room
          </Button>
        </div>
        {visibleModal && <StartRoomModal onClose={() => setVisibleModal(false)} />}
        <div className="grid mt-30">
          {rooms.map((obj) => (
            <Link key={obj.id} href={`/rooms/${obj.id}`}>
              <a className="d-flex"> 
                <ConversationCard
                  title={obj.title}
                  speakers={obj.speakers}
                  listenersCount={obj.listenersCount}
                />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

// get data from server side and pass it to component as props 
// getServerSideProps - function that will be executed on server side before component will be rendered on client side 
export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async (ctx) => {
  // all code here will be executed on server
  try {
    const user = await checkAuth(ctx); // check if user is authorized (if he has token) and return user data if he is authorized  

    if (!user) { // if user is not authorized
      return {
        props: {}, // next.js needs to return props
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    const rooms = await Api(ctx).getRooms();

    ctx.store.dispatch(setRooms(rooms));

    return {
      props: {},
    };
  } catch (error) {
    console.log('ERROR!');
    return {
      props: {
        rooms: [],
      },
    };
  }
});

export default RoomsPage;
