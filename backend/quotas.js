let db = null;

const initializeQuotasDB = (database) => {
    db = database;
};

const getQuotas = async (userId) => {
    return new Promise((resolve) => {
        db.get('SELECT * FROM quotas WHERE user_id = ?', [userId], async (err, quotas) => {
            if (err || !quotas) {
                resolve({ success: false, message: 'Quotas not found', data: null });
                return;
            }

            db.all('SELECT * FROM labs WHERE user_id = ? AND destroyed_at IS NULL', [userId], (err, labs) => {
                if (err) {
                    resolve({ success: false, message: 'Error fetching labs', data: null });
                    return;
                }

                const usedLabs = labs.length;
                const usedCpu = labs.reduce((sum, lab) => sum + (lab.resource_cpu || 0), 0);
                const usedMemory = labs.reduce((sum, lab) => sum + (lab.resource_memory_gb || 0), 0);
                const usedStorage = labs.reduce((sum, lab) => sum + (lab.resource_storage_gb || 0), 0);

                resolve({
                    success: true,
                    message: 'Quotas retrieved',
                    data: {
                        max_labs: quotas.max_labs,
                        max_cpu: quotas.max_cpu,
                        max_memory_gb: quotas.max_memory_gb,
                        max_storage_gb: quotas.max_storage_gb,
                        used_labs: usedLabs,
                        used_cpu: usedCpu,
                        used_memory_gb: usedMemory,
                        used_storage_gb: usedStorage,
                        available_labs: quotas.max_labs - usedLabs,
                        available_cpu: quotas.max_cpu - usedCpu,
                        available_memory_gb: quotas.max_memory_gb - usedMemory,
                        available_storage_gb: quotas.max_storage_gb - usedStorage
                    }
                });
            });
        });
    });
};

const checkQuotaAvailable = async (userId, requiredCpu, requiredMemoryGb) => {
    return new Promise((resolve) => {
        db.get('SELECT * FROM quotas WHERE user_id = ?', [userId], async (err, quotas) => {
            if (err || !quotas) {
                resolve({ available: false, reason: 'User quotas not found' });
                return;
            }

            db.all('SELECT * FROM labs WHERE user_id = ? AND destroyed_at IS NULL', [userId], (err, labs) => {
                if (err) {
                    resolve({ available: false, reason: 'Error checking current usage' });
                    return;
                }

                const usedCpu = labs.reduce((sum, lab) => sum + (lab.resource_cpu || 0), 0);
                const usedMemory = labs.reduce((sum, lab) => sum + (lab.resource_memory_gb || 0), 0);

                const cpuAvailable = quotas.max_cpu - usedCpu >= requiredCpu;
                const memoryAvailable = quotas.max_memory_gb - usedMemory >= requiredMemoryGb;

                if (!cpuAvailable) {
                    resolve({ available: false, reason: `Insufficient CPU quota. Required: ${requiredCpu}, Available: ${quotas.max_cpu - usedCpu}` });
                } else if (!memoryAvailable) {
                    resolve({ available: false, reason: `Insufficient memory quota. Required: ${requiredMemoryGb}GB, Available: ${quotas.max_memory_gb - usedMemory}GB` });
                } else {
                    resolve({ available: true });
                }
            });
        });
    });
};

const checkCanCreateLab = async (userId, labType, labTypeConfig) => {
    return new Promise((resolve) => {
        if (!labTypeConfig[labType]) {
            resolve({ canCreate: false, error: `Invalid lab type: ${labType}` });
            return;
        }

        const config = labTypeConfig[labType];
        db.get('SELECT * FROM quotas WHERE user_id = ?', [userId], async (err, quotas) => {
            if (err || !quotas) {
                resolve({ canCreate: false, error: 'User quotas not found' });
                return;
            }

            db.all('SELECT * FROM labs WHERE user_id = ? AND destroyed_at IS NULL', [userId], (err, labs) => {
                if (err) {
                    resolve({ canCreate: false, error: 'Error checking current usage' });
                    return;
                }

                const usedLabs = labs.length;
                const usedCpu = labs.reduce((sum, lab) => sum + (lab.resource_cpu || 0), 0);
                const usedMemory = labs.reduce((sum, lab) => sum + (lab.resource_memory_gb || 0), 0);
                const usedStorage = labs.reduce((sum, lab) => sum + (lab.resource_storage_gb || 0), 0);

                const canCreateMore = usedLabs < quotas.max_labs;
                const hasCpu = usedCpu + config.cpu <= quotas.max_cpu;
                const hasMemory = usedMemory + config.memory <= quotas.max_memory_gb;
                const hasStorage = usedStorage + config.storage <= quotas.max_storage_gb;

                if (!canCreateMore) {
                    resolve({ canCreate: false, error: `Lab limit reached (${quotas.max_labs} labs max)` });
                } else if (!hasCpu) {
                    resolve({ canCreate: false, error: `Insufficient CPU. Need ${config.cpu}, have ${quotas.max_cpu - usedCpu}` });
                } else if (!hasMemory) {
                    resolve({ canCreate: false, error: `Insufficient memory. Need ${config.memory}GB, have ${quotas.max_memory_gb - usedMemory}GB` });
                } else if (!hasStorage) {
                    resolve({ canCreate: false, error: `Insufficient storage. Need ${config.storage}GB, have ${quotas.max_storage_gb - usedStorage}GB` });
                } else {
                    resolve({ canCreate: true });
                }
            });
        });
    });
};

const updateUsedResources = (userId, labId, cpuUsed, memoryUsed) => {
    return new Promise((resolve) => {
        db.run(
            'UPDATE labs SET resource_cpu = ?, resource_memory_gb = ? WHERE id = ? AND user_id = ?',
            [cpuUsed, memoryUsed, labId, userId],
            (err) => {
                if (err) {
                    resolve({ success: false, message: 'Error updating resources' });
                } else {
                    resolve({ success: true, message: 'Resources updated' });
                }
            }
        );
    });
};

const freeResources = (userId, labId) => {
    return new Promise((resolve) => {
        db.run(
            'UPDATE labs SET destroyed_at = ? WHERE id = ? AND user_id = ?',
            [new Date().toISOString(), labId, userId],
            (err) => {
                if (err) {
                    resolve({ success: false, message: 'Error freeing resources' });
                } else {
                    resolve({ success: true, message: 'Resources freed' });
                }
            }
        );
    });
};

module.exports = {
    initializeQuotasDB,
    getQuotas,
    checkQuotaAvailable,
    checkCanCreateLab,
    updateUsedResources,
    freeResources
};
