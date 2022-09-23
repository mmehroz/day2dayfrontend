import { motion } from 'framer-motion';
import { fadeInTop } from '@utils/motion/fade-in-top';
import Image from 'next/image';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';

interface Props {
  data: any;
  className?: string;
}
const myLoader = ({ src }) => {
  return `${API_ENDPOINTS.NEXT_PUBLIC_REST_ENDPOINT}/assets/img/${src}`;
};

const AccountDetails: React.FC<Props> = ({ data }) => {
  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      //@ts-ignore
      variants={fadeInTop(0.35)}
      className={`w-full flex flex-col`}
    >
      <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
        {'Account Details'}
      </h2>

      <div className="w-full mx-auto flex flex-col justify-center">
        {data?.map((details: any) => (
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
              <Image
                loader={myLoader}
                src={details.photo}
                width={200}
                height={200}
                quality={100}
                alt={details.username?.username}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
              <span className="lable">Name: </span> <span> {details.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
              <span className="lable">Username: </span>{' '}
              <span> {details.username}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
              <span className="lable">Email: </span>{' '}
              <span> {details.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
              <span className="lable">Contact: </span>{' '}
              <span> {details.number}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-s-3 space-y-4 sm:space-y-0">
              <span className="lable">Join Date: </span>{' '}
              <span> {details.created_at}</span>
            </div>
          </div>
        ))}
      </div>
	  
    </motion.div>
  );
};

export default AccountDetails;
