import React from 'react';
import { Api } from '../../api';
import { BackButton } from '../../components/BackButton';
import { Header } from '../../components/Header';
import { Room } from '../../components/Room';
import { wrapper } from '../../redux/store';
import { checkAuth } from '../../utils/checkAuth';

export default function RoomPage({ room }) { // room - data of room that we get from server side  
  return (
    <>
      <Header />
      <div className="container mt-40">
        <BackButton title="All rooms" href="/rooms" />
      </div>
      <Room title={room.title} />
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
  // ctx - context of request
  try {
    const user = await checkAuth(ctx);

    if (!user) {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    const roomId = ctx.query.id; // get id from url
    const room = await Api(ctx).getRoom(roomId as string); // get room data by id from url  

    return {
      props: {
        room,
      },
    };
  } catch (error) {
    console.log('ERROR!');
    return {
      props: {},
      redirect: {
        destination: '/rooms',
        permanent: false,
      },
    };
  }
});
