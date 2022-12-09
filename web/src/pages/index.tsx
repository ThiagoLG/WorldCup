import React from "react";

interface HomeProps {
  count: number
}

export default function Home(props: HomeProps) {

  return (
    <h1 className="">Contagem - {props.count}</h1>
  )
}

export const getServerSideProps = async () => {
  const response = await fetch('http://localhost:3333/pools/count');
  console.log('response', response)
  const data = await response.json();

  return {
    props: {
      count: data.pools
    }
  }

}