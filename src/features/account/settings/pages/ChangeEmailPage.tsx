import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations/commonAnimations";

function ChangeEmailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background rounded-4xl">
      <motion.div
        {...fadeInUp}
        className="top-0 z-20 bg-background rounded-t-4xl"
      >
        <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-12">
          <h1 className="text-2xl font-bold">Cambiar correo electrónico</h1>
        </div>
      </motion.div>
    </div>
  );
}

export default ChangeEmailPage;
