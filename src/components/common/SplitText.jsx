import React from 'react';
import { motion } from 'framer-motion';

const SplitText = ({ children, className, delay = 0 }) => {
    // Helper to split text into words and characters
    // Handle non-string children gracefully
    const text = typeof children === 'string' ? children : '';
    const words = text.split(' ');

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.04 * i + delay },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: 'spring',
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            className={`flex flex-wrap overflow-hidden ${className}`}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {words.map((word, index) => (
                <div key={index} className="flex mr-[0.25em]"> {/* mr is for space between words */}
                    {word.split('').map((char, charIndex) => (
                        <motion.span variants={child} key={charIndex}>
                            {char}
                        </motion.span>
                    ))}
                </div>
            ))}
        </motion.div>
    );
};

export default SplitText;
