interface MessageWrapperProps {
  message: string;
}

export const MessageWrapper = ({ message }: MessageWrapperProps) => {
  return <div className='text-[14px] h-[120px] py-3'>{message}</div>;
};
