const Page = ({ params }: { params: { id: string } }) => {
  return <div>Meeting Room: #{params.id}</div>;
};

export default Page;
