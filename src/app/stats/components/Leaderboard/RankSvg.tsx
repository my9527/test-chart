type TRankSvgProps = {
  fill?: string,
  className?: string
}
export const RankSvg = ({ fill = "#FFDA46", className }: TRankSvgProps) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M26.0346 11.6532C24.3118 10.4945 23.4547 8.41739 23.8526 6.37968C24.1893 4.1758 23.2535 3.25314 21.0584 3.58547C19.0207 3.9834 16.9349 3.12196 15.7805 1.39471C14.4643 -0.389383 13.1437 -0.389383 11.8231 1.39471C10.6643 3.11759 8.58724 3.97902 6.54953 3.5811C4.35002 3.2444 3.41862 4.1758 3.75532 6.37531C4.15762 8.40865 3.30055 10.4901 1.57768 11.6489C-0.210789 12.9651 -0.210789 14.29 1.57768 15.6062C3.30055 16.765 4.15762 18.8421 3.75532 20.8798C3.41862 23.0837 4.35439 24.0064 6.54953 23.674C8.58724 23.2761 10.6643 24.1375 11.8231 25.8604C13.1393 27.6445 14.4643 27.6445 15.7805 25.8604C16.9393 24.1375 19.0163 23.2761 21.054 23.6784C23.2535 24.0151 24.1849 23.0837 23.8482 20.8842C23.4459 18.8508 24.303 16.765 26.0303 15.6106C27.8231 14.2944 27.8231 12.9782 26.0346 11.6532Z" fill={fill} />
    </svg>
  )
}