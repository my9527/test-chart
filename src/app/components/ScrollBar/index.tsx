import * as React from 'react';
import { MacScrollbar, MacScrollbarProps } from 'mac-scrollbar';

export type ScrollbarProps = MacScrollbarProps;

export const Scrollbar: React.FC<ScrollbarProps> = (props: ScrollbarProps) => {
  const { children, ...rest } = props;

  return (
    <MacScrollbar
      className="component-scrollbar full"
      skin="dark"
      thumbStyle={(horizontal) => ({
        [horizontal ? 'height' : 'width']: 4,
        background: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 6,
      })}
      trackStyle={(horizontal) => ({ [horizontal ? 'bottom' : 'right']: 1, width: 0, border: 0 })}
      trackGap={[4, 4, 4, 4]}
      {...rest}
    >
      {children}
    </MacScrollbar>
  );
};
