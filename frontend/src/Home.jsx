import { Link, useParams } from "react-router-dom";
import { useGetTopProductsQuery } from "./redux/api/productApiSlice";
import Loader from "./components/Loader";
import Message from "./components/Message";
import Header from "./components/Header";

const Home = () => {
    const {keyword} = useParams()
    const {data, isLoading, isError} = useGetTopProductsQuery({keyword})

  return (
    <>{!keyword ? <Header /> : null}</>
  )
}

export default Home