import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { UserData } from '..';
import { Api } from '../../api';
import { Header } from '../../components/Header';
import { Profile } from '../../components/Profile';
import { wrapper } from '../../redux/store';
import { checkAuth } from '../../utils/checkAuth';

interface ProfilePageProps {
  profileData: UserData | null;
}

const ProfilePage: NextPage<ProfilePageProps> = ({ profileData }) => {
  const router = useRouter();

  return (
    <>
      <Header />
      <div className="container mt-30">
        <Profile
          avatarUrl={profileData.avatarUrl}
          fullname={profileData.fullname}
          username={profileData.username}
          about="Test info"
        />
      </div>
    </>
  );
};

export default ProfilePage;

// getServerSideProps - function that will be called on server side   before component will be rendered on client side 
export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => { // ctx - context of request 
  try {
    const user = await checkAuth(ctx); // check if user is authorized (if he has token) and return user data if he is authorized

    const userId = ctx.query.id; // get id from url 
    const profileData = await Api(ctx).getUserInfo(Number(userId));

    if (!user || !profileData) {
      throw new Error();
    }

    return {
      props: {
        profileData,
      },
    };
  } catch (error) {
    return {
      props: {},
      redirect: { permanent: false, destination: '/' },
    };
  }
});
