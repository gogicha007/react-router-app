import './card-list.css';
import { useLocation, Link } from 'react-router';
import type { ICharacterDetails, IResponse } from '~/types/interface';
import { useEffect, useState } from 'react';
import { Card } from '../card/Card';

const Results = (data: IResponse) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setDetailsOpen(false);
  }, [data]);

  return (
    <div className="results">
      {data?.results?.map((obj: ICharacterDetails) => (
        <Link
          to={{ pathname: `${obj.id}`, search: `${location.search}` }}
          key={obj.id}
          onClick={() => console.log(`${detailsOpen}`)}
        >
          <div role="card">
            <Card {...obj} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Results;
