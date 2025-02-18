import { useNavigate, useOutletContext, useParams } from 'react-router';
import { useGetDetailsQuery } from '../state/features/characters/charactersApiSlice';
import Loader from '../components/loader/Loader';
import { useEffect } from 'react';

interface IFContext {
  closeClicked: () => void;
  counter: number;
}

export default function Details() {
  const context = useOutletContext<IFContext>();
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: obj,
    isFetching,
    error,
  } = useGetDetailsQuery({ id: id as string });

  useEffect(() => {
    console.log('open');
  }, [id]);

  const handleClickClose = () => {
    navigate(context?.counter > 0 ? -context.counter : -1);
    context?.closeClicked();
    console.log('close clicked');
  };

  if (isFetching) {
    return <Loader />;
  }

  if (error || !obj) {
    return <div>Error loading character details</div>;
  }

  return (
    <div className="details">
      <div className="details__data">
        <img src={obj?.image} alt="image" />
        <p>{obj?.name}</p>
        <p>{obj?.origin?.name}</p>
        <p>{obj?.location?.name}</p>
      </div>
      <button onClick={handleClickClose}>Close details</button>
    </div>
  );
}
