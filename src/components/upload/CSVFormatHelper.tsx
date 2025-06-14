import { REQUIRED_CSV_COLUMNS } from '../../constants'

export const CSVFormatHelper = () => {
  const sampleData = [
    {
      MessageID: '1',
      CandidateID: 'CAND001',
      Entity: 'AI',
      Message: 'Hello! I noticed your background in software engineering...',
      Date: '15/3/2024 2:30 pm',
      FullName: 'John Doe',
    },
    {
      MessageID: '2',
      CandidateID: 'CAND001',
      Entity: 'user',
      Message: 'Hi! Yes, I have 5 years of experience in React and Node.js...',
      Date: '15/3/2024 2:35 pm',
      FullName: 'John Doe',
    },
  ]

  return (
    <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        CSV Format Requirements
      </h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Required Columns:</h4>
          <div className="flex flex-wrap gap-2">
            {REQUIRED_CSV_COLUMNS.map((column) => (
              <span
                key={column}
                className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm font-mono"
              >
                {column}
              </span>
            ))}
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm font-mono text-gray-500">
              FullName (optional)
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Example Data:</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {Object.keys(sampleData[0]).map((header) => (
                    <th
                      key={header}
                      className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    {Object.values(row).map((value, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-3 py-2 text-gray-600 dark:text-gray-400 font-mono text-xs"
                      >
                        {value.length > 30 ? `${value.substring(0, 30)}...` : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>• Entity values should be "AI" or "user"</p>
          <p>• Date format: "d/m/yyyy h:mm am/pm" (e.g., "15/3/2024 2:30 pm")</p>
          <p>• MessageID should be unique for each message</p>
          <p>• CandidateID groups messages by candidate</p>
        </div>
      </div>
    </div>
  )
}
