import { useState, useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';

interface WaitlistItem {
  createdOn: string;
  payer: string;
  status: string;
  email: string;
  phone: string;
  services: string;
  scheduled: string;
}

interface Props {
  selectedService: string[];
  setSelectedService: React.Dispatch<React.SetStateAction<string[]>>;
}

const ServicesProducts: React.FC<Props> = ({ selectedService, setSelectedService }) => {
  const [searchText, setSearchText] = useState("");
  const [waitlistData, setWaitlistData] = useState<WaitlistItem[]>([]);
  const [filteredServiceNames, setFilteredServiceNames] = useState<string[]>([]);
  const [showNoResults, setShowNoResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('waitlistData.json');
        const data: WaitlistItem[] = await response.json();
        setWaitlistData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterServiceNames = () => {
      const filteredNames = waitlistData
        .filter(item => item.services.toLowerCase().includes(searchText.toLowerCase()))
        .map(item => item.services);
      const uniqueNames = Array.from(new Set(filteredNames));

      setFilteredServiceNames(uniqueNames);
      setShowNoResults(uniqueNames.length === 0 && searchText.trim() !== "");
    };

    filterServiceNames();
  }, [searchText, waitlistData]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleServiceCheckboxChange = (serviceName: string) => {
    setSelectedService(prevSelected => {
      if (prevSelected.includes(serviceName)) {
        return prevSelected.filter(item => item !== serviceName);
      } else {
        const newSelected = [...prevSelected];
        waitlistData.forEach(item => {
          if (item.services === serviceName && !newSelected.includes(serviceName)) {
            newSelected.push(serviceName);
          }
        });
        return newSelected;
      }
    });
  };

  const resultMessage = `Showing ${filteredServiceNames.length} result${filteredServiceNames.length !== 1 ? 's' : ''} matching '${searchText}'`;

  return (
    <div className="p-6">
      <div className="relative w-350 h-[28px] mb-4">
        <input
          type="text"
          className="w-full h-full pl-12 pr-4 py-2 border border-gray-300 rounded focus:outline-none"
          placeholder="Search"
          value={searchText}
          onChange={handleSearchInputChange}
        />
        {searchText && (
        <p className="text-sm text-gray-600 mb-2">{resultMessage}</p>
      )}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <CiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
      {searchText && ( 
        <div className="mt-2 w-full max-h-64 overflow-y-auto" style={{height : '11rem'}}>
          {filteredServiceNames.map((serviceName, index) => (
            <div key={index} className="flex items-center justify-between p-2 border-b border-gray-300">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  onChange={() => handleServiceCheckboxChange(serviceName)}
                  checked={selectedService.includes(serviceName)}
                  className="form-checkbox h-4 w-4 text-gray-600 mr-2"
                />
                <div className="text-sm font-medium text-gray-900">{serviceName}</div>
              </div>
              <div>
                {waitlistData.filter(item => item.services === serviceName).map((item, subIndex) => (
                  <span
                    key={subIndex}
                    className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                      item.status === "Active"
                        ? "bg-green-200 text-green-800"
                        : item.status === "Lead"
                        ? "bg-blue-200 text-blue-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {showNoResults && (
            <div className="p-2 text-sm text-gray-600">No results found</div>
          )}
        </div>
      )}
      
    </div>
  );
};

export default ServicesProducts;
