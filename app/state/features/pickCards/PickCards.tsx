import type { RootState } from '~/state/store';
import type { IResponse } from '~/types/interface';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelection } from './selectedCardsSlice';
import { useState } from 'react';
import Papa from 'papaparse';
import { FileDownloader } from '../../../components/file-downloader/FileDownloader';

type Props = {
  data: IResponse;
};
const PickCards = (props: Props) => {
  const dispatch = useDispatch();
  const selectedCards = useSelector(
    (state: RootState) => state.selectedCards.selectedCards
  );
  const [csvContent, setCsvContent] = useState<string | null>(null);

  const handleDownloadCSV = () => {
    if (!props.data || !props.data.results) return;

    const selectedData = props.data.results.filter((card) =>
      selectedCards.includes(card.id)
    );

    if (selectedData.length === 0) {
      alert('No cards selected for download!');
      return;
    }

    const csv = Papa.unparse(
      selectedData.map(({ id, name, image, species, status }) => ({
        ID: id,
        Name: name,
        Image: image,
        Species: species,
        Status: status,
      })),
      {
        quotes: true,
        header: true,
      }
    );
    setCsvContent(csv);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${selectedCards.length}_characters.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      <h2>Items selected: {selectedCards.length}</h2>
      <button onClick={() => dispatch(clearSelection())}>Deselect all</button>
      <button onClick={handleDownloadCSV}>Download CSV</button>
      {csvContent && (
        <FileDownloader
          fileName={`${selectedCards.length}_characters.csv`}
          fileContent={csvContent}
        />
      )}
    </>
  );
};

export default PickCards;
