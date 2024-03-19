
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

function PageDashboard  () {
    return (
        <div>this is dashboard
            <Link href={'/perpetual/BEAM'}>perpetual/BEAM</Link>

            <div>
            <ConnectButton />
            </div>
        </div>
    );
}

PageDashboard.displayName = 'PageDashboard';

export default PageDashboard;