import { getProviders, signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { Fragment } from 'react';
export default function Signin({ providers }) {
  return (
    <Fragment>
      <div className="flex mx-auto p-4 items-center justify-center">
        {Object.values(providers).map((provider) => (
          <div className="flex flex-col items-center" key={provider.name}>
            <p className="italic my-10 text-center text-md">Sign In</p>
            <div
              onClick={() => signIn(provider.id, { callbackUrl: '/' })}
              className="bg-white rounded-lg py-4 px-4 text-black hover:opacity-90 flex items-center space-x-6 hover:cursor-pointer shadow-lg"
            >
              {provider.name === 'Google' ? (
                <div className="flex">
                  <FcGoogle className="h-8 w-8"></FcGoogle>
                </div>
              ) : (
                ''
              )}
              <div className="text-xl"> Login with {provider.name}</div>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
}

// server side rendering to get info from next auth
export async function getServerSideProps(context) {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
