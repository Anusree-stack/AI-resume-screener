import { List } from 'react-window';
import CandidateCard from './CandidateCard';
import type { Candidate } from '../types';

interface VirtualBucketProps {
    candidates: Candidate[];
    onSelectCandidate: (id: string) => void;
    onToggleShortlist: (id: string) => void;
    height: number;
}

export default function VirtualBucket({
    candidates,
    onSelectCandidate,
    onToggleShortlist,
    height
}: VirtualBucketProps) {
    const Row = ({ index, style }: any) => {
        const candidate = candidates[index];
        if (!candidate) return null;
        return (
            <div style={{ ...style, padding: '0 4px 10px 0' }}>
                <CandidateCard
                    candidate={candidate}
                    onClick={() => onSelectCandidate(candidate.id)}
                    onToggleShortlist={onToggleShortlist}
                    rank={candidate.globalRank}
                />
            </div>
        );
    };

    return (
        <List<any>
            rowCount={candidates.length}
            rowHeight={250} // Approximate height of CandidateCard
            rowComponent={Row}
            rowProps={{}}
            style={{ height, width: '100%', overflowX: 'hidden' }}
        />
    );
}
