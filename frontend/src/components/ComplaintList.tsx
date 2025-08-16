import { Complaint } from '@/types/complaint';
import { ComplaintDto} from '@/types/dto';

interface ComplaintListProps {
  complaints: Complaint[];
}

export function ComplaintList({ complaints }: ComplaintListProps) {
  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <div
          key={complaint.id}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold">{complaint.title}</h3>
          <p className="text-gray-600">{complaint.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            Status: {complaint.status}
          </div>
        </div>
      ))}
    </div>
  );
}