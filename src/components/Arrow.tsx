type Direction = 'diagonal' | 'down-right' | 'down' | 'up' | 'left' | 'right';
const rotation: Record<Direction, number> = {diagonal:45,'down-right':135,down:180,up:0,left:270,right:90};
/** A long steel tip, ribbed barrel and compact split flights. */
export default function Arrow({direction='diagonal'}:{direction?:Direction}) {
 return <span className="trajectory-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" focusable="false"><g transform={`rotate(${rotation[direction]} 12 12)`} stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter"><path d="M12 1V7M12 15V22"/><path d="M10.5 7H13.5V14L12 16L10.5 14Z" fill="currentColor"/><path d="M12 18L7 15V21L12 23L17 21V15Z"/><path d="M12 18V23M7 15L12 22L17 15"/></g></svg></span>;
}
