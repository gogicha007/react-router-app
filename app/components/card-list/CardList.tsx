import './card-list.css';
// import { useCharacterFilters } from '~/hooks/useCharacterFilters';
// import { useGetListQuery } from '~/state/features/characters/charactersApiSlice';
import { useLocation, Link } from 'react-router';
import type {
  ICharacterDetails,
  IResponse,
  IRespInfo,
} from '~/types/interface';
import { useEffect, useState } from 'react';
import { Card } from '../card/Card';
import { Pagination } from '../pagination/Pagination';

const Results = (data: IResponse) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    console.log('card list info', data.info);
    setDetailsOpen(false);
  }, [data]);

  return (
    <div className="results">
      <div className="results__main">
        <div className="results__list">
          {data?.results?.map((obj: ICharacterDetails) => (
            <Link
              to={{ pathname: `${obj.id}`, search: `${location.search}` }}
              key={obj.id}
              onClick={() => console.log(`${obj.id}`)}
            >
              <div role="card">
                <Card {...obj} />
              </div>
            </Link>
          ))}
          <div className="results__pagination">
            {data?.info && (
              <Pagination
                disabled={detailsOpen}
                resInfo={data.info as IRespInfo}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
