interface NextDirProps {
  nextTurn: string;
}

export default function NextDirection({ nextTurn }: NextDirProps) {
  return <div>{nextTurn}</div>;
}
