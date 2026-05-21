const mockVMs = {};

const generateMockVMID = () => {
    return Math.floor(Math.random() * 100) + 300;
};

const generateMockIP = () => {
    const lastOctet = Math.floor(Math.random() * 254) + 1;
    return `192.168.122.${lastOctet}`;
};

const createVM = async (templateId, vmId, vmName, sessionId) => {
    return new Promise((resolve) => {
        const mockVMID = generateMockVMID();
        const mockIP = generateMockIP();
        
        const vmData = {
            vmid: mockVMID,
            vmname: vmName,
            ip_address: mockIP,
            status: 'booting',
            created_at: new Date().toISOString(),
            sessionId: sessionId
        };
        
        mockVMs[mockVMID] = vmData;
        
        setTimeout(() => {
            mockVMs[mockVMID].status = 'running';
        }, 15000);
        
        resolve({
            success: true,
            message: 'VM created successfully',
            data: {
                vmid: mockVMID,
                vmname: vmName,
                ip_address: mockIP,
                status: 'booting',
                hostname: vmName,
                ssh_command: `ssh root@${mockIP}`
            }
        });
    });
};

const destroyVM = async (vmId) => {
    return new Promise((resolve) => {
        if (mockVMs[vmId]) {
            delete mockVMs[vmId];
            resolve({
                success: true,
                message: 'VM destroyed successfully',
                data: { vmid: vmId }
            });
        } else {
            resolve({
                success: false,
                message: 'VM not found',
                data: null
            });
        }
    });
};

const getVMStatus = async (vmId) => {
    return new Promise((resolve) => {
        const vm = mockVMs[vmId];
        if (vm) {
            resolve({
                success: true,
                message: 'VM status retrieved',
                data: {
                    vmid: vm.vmid,
                    vmname: vm.vmname,
                    status: vm.status,
                    ip_address: vm.ip_address,
                    cpu: 2,
                    memory: 2048,
                    created_at: vm.created_at
                }
            });
        } else {
            resolve({
                success: false,
                message: 'VM not found',
                data: null
            });
        }
    });
};

const listActiveVMs = async () => {
    return new Promise((resolve) => {
        const vms = Object.values(mockVMs).map(vm => ({
            vmid: vm.vmid,
            vmname: vm.vmname,
            status: vm.status,
            ip_address: vm.ip_address,
            created_at: vm.created_at
        }));
        
        resolve({
            success: true,
            message: 'VMs listed successfully',
            data: vms
        });
    });
};

module.exports = {
    createVM,
    destroyVM,
    getVMStatus,
    listActiveVMs,
    generateMockVMID,
    generateMockIP
};
