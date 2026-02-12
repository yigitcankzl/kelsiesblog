import { AnimatePresence, motion } from 'framer-motion';
import { useBlogStore } from '../../store/store';
import WelcomeView from './WelcomeView';
import CountryPostsView from './CountryPostsView';
import PostReader from './PostReader';

export default function ContentArea() {
    const { selectedCountry, selectedPost } = useBlogStore();

    return (
        <div className="flex-1 overflow-y-auto bg-[#faf8f5]">
            <AnimatePresence mode="wait">
                {selectedPost ? (
                    <motion.div
                        key="post"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        <PostReader />
                    </motion.div>
                ) : selectedCountry ? (
                    <motion.div
                        key={`country-${selectedCountry}`}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        <CountryPostsView />
                    </motion.div>
                ) : (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        <WelcomeView />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
