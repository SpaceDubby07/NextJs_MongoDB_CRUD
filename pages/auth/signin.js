import { getProviders, signIn } from 'next-auth/react';
import { Fragment } from 'react';
export default function Signin({ providers }) {
  return (
    <Fragment>
      {/* <Header /> */}
      <div className="flex justify-center space-x-7 mt-20">
        <div className="">
          {Object.values(providers).map((provider) => (
            <div className="flex flex-col items-center" key={provider.name}>
              <p className="text-sm italic my-10 text-center">
                This app is created for learning purposes
              </p>
              <button
                onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                className="bg-red-400 rounded-lg p-3 text-white hover:bg-red-500"
              >
                Sign In with {provider.name}
              </button>
            </div>
          ))}
        </div>
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
