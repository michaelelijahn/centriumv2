import React, { useState } from 'react';
import { Form, Row, Col, Alert, Card, ListGroup } from 'react-bootstrap';
import MultiStepFormWrapper from '../../../components/KYCForm/MultiStepFormWrapper';

const IndonesianPersonForm = () => {
    const [formData, setFormData] = useState({});

    const steps = [
        {
            title: "Requirements",
            description: "Document checklist"
        },
        {
            title: "Data Pribadi",
            description: "Personal information"
        },
        {
            title: "Emergency Contact",
            description: "Emergency contact details"
        },
        {
            title: "Data Pekerjaan",
            description: "Employment information"
        },
        {
            title: "Daftar Kekayaan",
            description: "Wealth information"
        },
        {
            title: "Rekening Bank",
            description: "Bank account details"
        },
        {
            title: "Document Upload",
            description: "Required documents"
        },
        {
            title: "Review & Submit",
            description: "Final review"
        }
    ];

    // Document requirements for Indonesian Person registration
    const documentRequirements = [
        {
            category: "Dokumen yang dilampirkan",
            documents: [
                "Rekening Koran / Tagihan Kartu Kredit",
                "Rekening Listrik / Telepon", 
                "Foto Terkini",
                "Identify No. (KTP)",
                "NPWP"
            ]
        }
    ];

    const renderStep = ({ currentStep, formData: stepData, updateFormData }) => {
        switch (currentStep) {
            case 0:
                return <RequirementsStep requirements={documentRequirements} />;
            case 1:
                return <DataPribadiStep data={stepData} onChange={updateFormData} />;
            case 2:
                return <EmergencyContactStep data={stepData} onChange={updateFormData} />;
            case 3:
                return <DataPekerjaanStep data={stepData} onChange={updateFormData} />;
            case 4:
                return <DaftarKekayaanStep data={stepData} onChange={updateFormData} />;
            case 5:
                return <RekeningBankStep data={stepData} onChange={updateFormData} />;
            case 6:
                return <DocumentUploadStep data={stepData} onChange={updateFormData} requirements={documentRequirements} />;
            case 7:
                return <ReviewStep allData={formData} />;
            default:
                return <RequirementsStep requirements={documentRequirements} />;
        }
    };

    const handleStepChange = (step, data) => {
        console.log(`Moving to step ${step}`, data);
    };

    const handleSubmit = (data) => {
        console.log('Submitting Indonesian Person KYC:', data);
        alert('Indonesian Person KYC submitted successfully!');
    };

    return (
        <MultiStepFormWrapper
            accountType="Indonesian Person"
            steps={steps}
            onStepChange={handleStepChange}
            onSubmit={handleSubmit}
        >
            {renderStep}
        </MultiStepFormWrapper>
    );
};

// Step Components
const RequirementsStep = ({ requirements }) => (
    <div>
        <div className="text-center mb-4">
            <h4 className="text-primary mb-3">Document Requirements</h4>
            <p className="text-muted fs-5">Please ensure you have all the following documents ready before proceeding</p>
        </div>

        <Row className="justify-content-center">
            {requirements.map((category, index) => (
                <Col md={8} lg={6} key={index} className="mb-4">
                    <Card className="border-0 shadow-sm h-100" style={{ minHeight: '280px', maxHeight: '320px' }}>
                        <Card.Header className="bg-light border-0 py-2">
                            <h5 className="mb-0 text-primary">
                                <i className="mdi mdi-folder-outline me-2"></i>
                                {category.category}
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-2 d-flex flex-column">
                            <ListGroup variant="flush" className="flex-grow-1">
                                {category.documents.map((doc, docIndex) => (
                                    <ListGroup.Item key={docIndex} className="px-0 py-2 border-0">
                                        <i className="mdi mdi-file-document-outline text-muted me-2"></i>
                                        <span className="text-muted">{doc}</span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>

        <Alert variant="info" className="mt-4">
            <h6 className="mb-2">
                <i className="mdi mdi-information me-2"></i>
                Important Notes
            </h6>
            <ul className="mb-0 small">
                <li>All documents must be in Indonesian or English</li>
                <li>Documents should be clear, legible scans or photos</li>
                <li>Maximum file size: 10MB per document</li>
                <li>Accepted formats: PDF, JPG, JPEG, PNG</li>
            </ul>
        </Alert>
    </div>
);

const DataPribadiStep = ({ data = {}, onChange }) => {
    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Data Pribadi</h4>
                <p className="text-muted fs-5">Please provide your personal information</p>
            </div>

                    <Form>
                {/* Basic Personal Information */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Lengkap <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                value={data.namaLengkap || ''}
                                onChange={(e) => onChange({ ...data, namaLengkap: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tempat Lahir <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Place of birth"
                                value={data.tempatLahir || ''}
                                onChange={(e) => onChange({ ...data, tempatLahir: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tanggal Lahir <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="date"
                                value={data.tanggalLahir || ''}
                                onChange={(e) => onChange({ ...data, tanggalLahir: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>No. KTP <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your KTP number"
                                value={data.noKTP || ''}
                                onChange={(e) => onChange({ ...data, noKTP: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>No. NPWP <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your NPWP number"
                                value={data.noNPWP || ''}
                                onChange={(e) => onChange({ ...data, noNPWP: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Jenis Kelamin <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.jenisKelamin || ''}
                                onChange={(e) => onChange({ ...data, jenisKelamin: e.target.value })}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Ibu Kandung <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Mother's full name"
                                value={data.namaIbuKandung || ''}
                                onChange={(e) => onChange({ ...data, namaIbuKandung: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Status Perkawinan <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.statusPerkawinan || ''}
                                onChange={(e) => onChange({ ...data, statusPerkawinan: e.target.value })}
                                required
                            >
                                <option value="">Select Marital Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Address Information */}
                <Row>
                    <Col md={8}>
                        <Form.Group className="mb-3">
                            <Form.Label>Street Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Street address"
                                value={data.streetAddress || ''}
                                onChange={(e) => onChange({ ...data, streetAddress: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>City <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="City"
                                value={data.city || ''}
                                onChange={(e) => onChange({ ...data, city: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Postal/Zip Code <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Postal code"
                                value={data.postalCode || ''}
                                onChange={(e) => onChange({ ...data, postalCode: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Contact Information */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>No. Telephone Rumah (Optional)</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Home phone number"
                                value={data.noTelephoneRumah || ''}
                                onChange={(e) => onChange({ ...data, noTelephoneRumah: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>No. Handphone <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Mobile phone number"
                                value={data.noHandphone || ''}
                                onChange={(e) => onChange({ ...data, noHandphone: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>No. Faksimili Rumah (Optional)</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Home fax number"
                                value={data.noFaksimiliRumah || ''}
                                onChange={(e) => onChange({ ...data, noFaksimiliRumah: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>E-mail <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email address"
                                value={data.email || ''}
                                onChange={(e) => onChange({ ...data, email: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Additional Information */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Status Kepemilikan Rumah <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.statusKepemilikanRumah || ''}
                                onChange={(e) => onChange({ ...data, statusKepemilikanRumah: e.target.value })}
                                required
                            >
                                <option value="">Select House Ownership Status</option>
                                <option value="Pribadi">Pribadi</option>
                                <option value="Keluarga">Keluarga</option>
                                <option value="Sewa/Kontrak">Sewa/Kontrak</option>
                                <option value="Lainnya">Lainnya</option>
                            </Form.Select>
                            {data.statusKepemilikanRumah === 'Lainnya' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Sebutkan status kepemilikan rumah lainnya"
                                    value={data.statusKepemilikanRumahOther || ''}
                                    onChange={(e) => onChange({ ...data, statusKepemilikanRumahOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tujuan Pembukaan Rekening <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.tujuanPembukaanRekening || ''}
                                onChange={(e) => onChange({ ...data, tujuanPembukaanRekening: e.target.value })}
                                required
                            >
                                <option value="">Select Account Purpose</option>
                                <option value="Lindung Nilai">Lindung Nilai</option>
                                <option value="Keuntungan">Keuntungan</option>
                                <option value="Spekulasi">Spekulasi</option>
                                <option value="Lainnya">Lainnya</option>
                            </Form.Select>
                            {data.tujuanPembukaanRekening === 'Lainnya' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Sebutkan tujuan pembukaan rekening lainnya"
                                    value={data.tujuanPembukaanRekeningOther || ''}
                                    onChange={(e) => onChange({ ...data, tujuanPembukaanRekeningOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Compliance Questions */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Pengalaman Investasi <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.pengalamanInvestasi || ''}
                                onChange={(e) => onChange({ ...data, pengalamanInvestasi: e.target.value })}
                                required
                            >
                                <option value="">Select Investment Experience</option>
                                <option value="Yes">Yes</option>
                                <option value="None">None</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Anggota Keluarga di BAPPEBTI/Bursa Berjangka? <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.anggotaKeluargaBAPPEBTI || ''}
                                onChange={(e) => onChange({ ...data, anggotaKeluargaBAPPEBTI: e.target.value })}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Pernah Dinyatakan Pailit? <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.pernahPailit || ''}
                                onChange={(e) => onChange({ ...data, pernahPailit: e.target.value })}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

const EmergencyContactStep = ({ data = {}, onChange }) => {
    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Pihak yang dihubungi dalam keadaan darurat</h4>
                <p className="text-muted fs-5">Emergency contact information</p>
            </div>

            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Lengkap <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Emergency contact full name"
                                value={data.emergencyContactName || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>No. Handphone <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Emergency contact phone number"
                                value={data.emergencyContactPhone || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactPhone: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={8}>
                        <Form.Group className="mb-3">
                            <Form.Label>Street Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Emergency contact street address"
                                value={data.emergencyContactStreetAddress || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactStreetAddress: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>City <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="City"
                                value={data.emergencyContactCity || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactCity: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label>Postal/Zip Code <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Postal code"
                                value={data.emergencyContactPostalCode || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactPostalCode: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={8}>
                        <Form.Group className="mb-3">
                            <Form.Label>Hubungan dengan Anda <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.emergencyContactRelationship || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactRelationship: e.target.value })}
                                required
                            >
                                <option value="">Select Relationship</option>
                                <option value="Pasangan">Pasangan (Spouse)</option>
                                <option value="Keluarga">Keluarga (Family)</option>
                                <option value="Anak">Anak (Child)</option>
                                <option value="Lainnya">Lainnya (Other)</option>
                            </Form.Select>
                            {data.emergencyContactRelationship === 'Lainnya' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Sebutkan hubungan lainnya"
                                    value={data.emergencyContactRelationshipOther || ''}
                                    onChange={(e) => onChange({ ...data, emergencyContactRelationshipOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

const DataPekerjaanStep = ({ data = {}, onChange }) => {
    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Data Pekerjaan</h4>
                <p className="text-muted fs-5">Employment information</p>
            </div>

            <Form>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Form.Group className="mb-3">
                            <Form.Label>Jenis Pekerjaan <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.jenisPekerjaan || ''}
                                onChange={(e) => onChange({ ...data, jenisPekerjaan: e.target.value })}
                                required
                            >
                                <option value="">Select Employment Type</option>
                                <option value="Swasta">Swasta (Private Employee)</option>
                                <option value="Wiraswasta">Wiraswasta (Entrepreneur)</option>
                                <option value="Ibu RT">Ibu RT (Housewife)</option>
                                <option value="Profesional">Profesional (Professional)</option>
                                <option value="ASN">ASN (Civil Servant)</option>
                                <option value="Mahasiswa">Mahasiswa (Student)</option>
                                <option value="Lainnya">Lainnya (Other)</option>
                            </Form.Select>
                            {data.jenisPekerjaan === 'Lainnya' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Sebutkan jenis pekerjaan lainnya"
                                    value={data.jenisPekerjaanOther || ''}
                                    onChange={(e) => onChange({ ...data, jenisPekerjaanOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                    </Form>
        </div>
    );
};

const DaftarKekayaanStep = ({ data = {}, onChange }) => {
    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Daftar Kekayaan</h4>
                <p className="text-muted fs-5">Wealth and asset information</p>
            </div>

            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Penghasilan Pertahun <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.penghasilanPertahun || ''}
                                onChange={(e) => onChange({ ...data, penghasilanPertahun: e.target.value })}
                                required
                            >
                                <option value="">Select Annual Income</option>
                                <option value="Antara 100 - 250 juta rupiah">Antara 100 - 250 juta rupiah</option>
                                <option value="Antara 250 - 500 juta rupiah">Antara 250 - 500 juta rupiah</option>
                                <option value="Di atas 500 juta rupiah">Di atas 500 juta rupiah</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Lokasi Rumah</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Property location"
                                value={data.lokasiRumah || ''}
                                onChange={(e) => onChange({ ...data, lokasiRumah: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nilai NJOP</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Property tax value (NJOP)"
                                value={data.nilaiNJOP || ''}
                                onChange={(e) => onChange({ ...data, nilaiNJOP: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Bank Deposit</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Bank deposit amount"
                                value={data.bankDeposit || ''}
                                onChange={(e) => onChange({ ...data, bankDeposit: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Jumlah</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Total amount"
                                value={data.jumlah || ''}
                                onChange={(e) => onChange({ ...data, jumlah: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Lainnya</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Other assets"
                                value={data.lainnya || ''}
                                onChange={(e) => onChange({ ...data, lainnya: e.target.value })}
                            />
                        </Form.Group>
                </Col>
            </Row>
            </Form>
        </div>
    );
};

const RekeningBankStep = ({ data = {}, onChange }) => {
    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Rekening Bank Nasabah</h4>
                <p className="text-muted fs-5">Bank account for margin deposits and withdrawals</p>
            </div>

            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Bank <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Bank name"
                                value={data.namaBank || ''}
                                onChange={(e) => onChange({ ...data, namaBank: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Cabang <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Bank branch"
                                value={data.cabang || ''}
                                onChange={(e) => onChange({ ...data, cabang: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>No. Rekening <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Account number"
                                value={data.noRekening || ''}
                                onChange={(e) => onChange({ ...data, noRekening: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Pemilik Rekening <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Account holder name"
                                value={data.namaPemilikRekening || ''}
                                onChange={(e) => onChange({ ...data, namaPemilikRekening: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                <Form.Group className="mb-3">
                            <Form.Label>No. Telepon Bank</Form.Label>
                    <Form.Control
                                type="tel"
                                placeholder="Bank phone number"
                                value={data.noTeleponBank || ''}
                                onChange={(e) => onChange({ ...data, noTeleponBank: e.target.value })}
                    />
                </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Jenis Rekening Bank <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.jenisRekeningBank || ''}
                                onChange={(e) => onChange({ ...data, jenisRekeningBank: e.target.value })}
                                required
                            >
                                <option value="">Select Account Type</option>
                                <option value="Giro">Giro</option>
                                <option value="Tabungan">Tabungan</option>
                                <option value="Lainnya">Lainnya</option>
                            </Form.Select>
                            {data.jenisRekeningBank === 'Lainnya' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Sebutkan jenis rekening bank lainnya"
                                    value={data.jenisRekeningBankOther || ''}
                                    onChange={(e) => onChange({ ...data, jenisRekeningBankOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

const DocumentUploadStep = ({ data = {}, onChange, requirements }) => {
    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Document Upload</h4>
                <p className="text-muted fs-5">Upload all required documents</p>
            </div>

            {requirements.map((category, index) => (
                <Card key={index} className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-light border-0">
                        <h6 className="mb-0 text-primary">{category.category}</h6>
                    </Card.Header>
                    <Card.Body>
                        {category.documents.map((doc, docIndex) => (
                            <Form.Group key={docIndex} className="mb-3">
                                <Form.Label>{doc} <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="file" accept=".pdf,.jpg,.jpeg,.png" />
                                <Form.Text className="text-muted">
                                    Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                                </Form.Text>
                            </Form.Group>
                        ))}
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

const ReviewStep = ({ allData }) => {
    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Review & Submit</h4>
                <p className="text-muted fs-5">Please review your information before submitting</p>
            </div>

            {/* Data Pribadi Summary */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0 text-primary">Data Pribadi</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Nama Lengkap:</strong> {allData.namaLengkap || 'Not provided'}</p>
                            <p><strong>Tempat Lahir:</strong> {allData.tempatLahir || 'Not provided'}</p>
                            <p><strong>Tanggal Lahir:</strong> {allData.tanggalLahir || 'Not provided'}</p>
                            <p><strong>No. KTP:</strong> {allData.noKTP || 'Not provided'}</p>
                            <p><strong>No. NPWP:</strong> {allData.noNPWP || 'Not provided'}</p>
                            <p><strong>Jenis Kelamin:</strong> {allData.jenisKelamin || 'Not provided'}</p>
                            <p><strong>Status Perkawinan:</strong> {allData.statusPerkawinan || 'Not provided'}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Nama Ibu Kandung:</strong> {allData.namaIbuKandung || 'Not provided'}</p>
                            <p><strong>Email:</strong> {allData.email || 'Not provided'}</p>
                            <p><strong>No. Handphone:</strong> {allData.noHandphone || 'Not provided'}</p>
                            <p><strong>Alamat:</strong> {`${allData.streetAddress || ''}, ${allData.city || ''}, ${allData.postalCode || ''}`.trim() || 'Not provided'}</p>
                            <p><strong>Status Kepemilikan Rumah:</strong> {allData.statusKepemilikanRumah || 'Not provided'}</p>
                            <p><strong>Tujuan Pembukaan Rekening:</strong> {allData.tujuanPembukaanRekening || 'Not provided'}</p>
                            <p><strong>Pengalaman Investasi:</strong> {allData.pengalamanInvestasi || 'Not provided'}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Emergency Contact Summary */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0 text-primary">Emergency Contact</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Nama Lengkap:</strong> {allData.emergencyContactName || 'Not provided'}</p>
                            <p><strong>No. Handphone:</strong> {allData.emergencyContactPhone || 'Not provided'}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Alamat:</strong> {`${allData.emergencyContactStreetAddress || ''}, ${allData.emergencyContactCity || ''}, ${allData.emergencyContactPostalCode || ''}`.trim() || 'Not provided'}</p>
                            <p><strong>Hubungan:</strong> {allData.emergencyContactRelationship || 'Not provided'}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Employment Summary */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0 text-primary">Data Pekerjaan</h6>
                </Card.Header>
                <Card.Body>
                    <p><strong>Jenis Pekerjaan:</strong> {allData.jenisPekerjaan || 'Not provided'}</p>
                </Card.Body>
            </Card>

            {/* Wealth Summary */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0 text-primary">Daftar Kekayaan</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Penghasilan Pertahun:</strong> {allData.penghasilanPertahun || 'Not provided'}</p>
                            <p><strong>Lokasi Rumah:</strong> {allData.lokasiRumah || 'Not provided'}</p>
                            <p><strong>Nilai NJOP:</strong> {allData.nilaiNJOP || 'Not provided'}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Bank Deposit:</strong> {allData.bankDeposit || 'Not provided'}</p>
                            <p><strong>Jumlah:</strong> {allData.jumlah || 'Not provided'}</p>
                            <p><strong>Lainnya:</strong> {allData.lainnya || 'Not provided'}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Bank Account Summary */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0 text-primary">Rekening Bank</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Nama Bank:</strong> {allData.namaBank || 'Not provided'}</p>
                            <p><strong>Cabang:</strong> {allData.cabang || 'Not provided'}</p>
                            <p><strong>No. Rekening:</strong> {allData.noRekening || 'Not provided'}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Nama Pemilik Rekening:</strong> {allData.namaPemilikRekening || 'Not provided'}</p>
                            <p><strong>Jenis Rekening:</strong> {allData.jenisRekeningBank || 'Not provided'}</p>
                            <p><strong>No. Telepon Bank:</strong> {allData.noTeleponBank || 'Not provided'}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Application Status */}
            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <h6 className="text-primary mb-3">Application Status</h6>
                    <Row>
                        <Col md={6}>
                            <p><strong>Account Type:</strong> Indonesian Person</p>
                            <p><strong>Status:</strong> Ready for submission</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Steps Completed:</strong> 7/7</p>
                            <p><strong>Documents:</strong> Ready for upload</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default IndonesianPersonForm; 