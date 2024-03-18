const CloseIcon: React.FC<{
  className?: string;
  onClick?: Function;
}> = ({ onClick, className }) => {
  return (
    <svg
      className={className}
      onClick={() => {
        onClick && onClick();
      }}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.586 7.19794L14.0862 1.69775L12.5862 0.197749L7.08599 5.69793L1.58594 0.197876L0.085933 1.69788L5.58599 7.19794L0.0862628 12.6977L1.58627 14.1977L7.08599 8.69794L12.5858 14.1978L14.0859 12.6978L8.586 7.19794Z"
        fill="white"
      />
    </svg>
  );
};
export default CloseIcon;
