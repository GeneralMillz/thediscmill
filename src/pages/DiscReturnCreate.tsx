import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CreateTagForm } from '../components/discReturn/CreateTagForm';
import { ReturnTagPreview } from '../components/discReturn/ReturnTagPreview';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { encodePayload } from '../utils/encode';

export function DiscReturnCreate() {
  const [encodedData, setEncodedData] = useState<string | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<any>(null);

  const handleSubmit = (data: any) => {
    const encoded = encodePayload(data);
    setEncodedData(encoded);
    setOwnerInfo(data);
    
    // Analytics
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'disc_return_tag_created');
    }
  };

  return (
    <div className="pt-24 pb-8 px-4 max-w-2xl mx-auto">
      <Helmet>
        <title>Create Return Tag | The Disc Mill</title>
        <meta name="description" content="Generate a free QR return tag for your disc. If someone finds it, they can scan it and contact you." />
      </Helmet>
      <Link to="/disc-return" className="inline-flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Return Network
      </Link>

      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-4">
          <Shield className="mr-3 text-indigo-600 w-8 h-8" />
          Create Your Return Tag
        </h1>
        <p className="text-gray-600">
          Enter the information you want to share with someone who finds your disc. This data is encoded directly into the QR code and is not stored on our servers.
        </p>
      </div>

      {!encodedData ? (
        <CreateTagForm onSubmit={handleSubmit} />
      ) : (
        <div className="space-y-8">
          <ReturnTagPreview encodedData={encodedData} ownerInfo={ownerInfo} />
          <button 
            onClick={() => setEncodedData(null)}
            className="w-full py-3 text-gray-500 font-medium hover:text-indigo-600 transition-colors"
          >
            Edit Information
          </button>
        </div>
      )}
    </div>
  );
}
