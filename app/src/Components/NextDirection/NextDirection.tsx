interface NextDirProps {
  nextTurn: string;
}

export default function NextDirection({ nextTurn }: NextDirProps) {
  return <div className="next-turn-container">{nextTurn}</div>;
}
